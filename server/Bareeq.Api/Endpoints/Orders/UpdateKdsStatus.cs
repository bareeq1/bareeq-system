using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Hubs;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class UpdateKdsStatus : EndpointBaseAsync
    .WithRequest<KdsStatusUpdateRequest>
    .WithActionResult<KdsStatusUpdateResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<OrderHub> _hub;

    public UpdateKdsStatus(AppDbContext dbContext, IHubContext<OrderHub> hub)
    {
        _dbContext = dbContext;
        _hub = hub;
    }

    [HttpPut("orders/{orderId:guid}/items/{itemId:guid}/kds-status")]
    [Authorize(Roles = "BranchStaff")]
    public override async Task<ActionResult<KdsStatusUpdateResponse>> HandleAsync(KdsStatusUpdateRequest request, CancellationToken cancellationToken = default)
    {
        var validStatuses = new[] { "Pending", "Preparing", "Ready", "Collected" };
        if (!validStatuses.Contains(request.KdsStatus))
            return BadRequest("KdsStatus must be Pending, Preparing, Ready, or Collected.");

        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var staffId))
            return Unauthorized();

        var staff = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == staffId, cancellationToken);
        if (staff is null)
            return Unauthorized();

        var orderId = Guid.Parse((string)RouteData.Values["orderId"]!);
        var itemId = Guid.Parse((string)RouteData.Values["itemId"]!);

        var order = await _dbContext.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
            return NotFound();

        if (order.BranchId != staff.BranchId)
            return Forbid();

        var item = order.Items.FirstOrDefault(i => i.Id == itemId);
        if (item is null)
            return NotFound();

        item.KdsStatus = request.KdsStatus;

        if (order.Items.All(i => i.KdsStatus == "Collected"))
            order.Status = "Completed";

        await _dbContext.SaveChangesAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(order.BranchId))
        {
            await _hub.Clients.Group($"branch-{order.BranchId}")
                .SendAsync("KdsStatusUpdated", new
                {
                    orderId = order.Id,
                    itemId = item.Id,
                    kdsStatus = item.KdsStatus,
                    orderStatus = order.Status
                }, cancellationToken);
        }

        return Ok(new KdsStatusUpdateResponse
        {
            OrderId = order.Id,
            ItemId = item.Id,
            KdsStatus = item.KdsStatus,
            OrderStatus = order.Status
        });
    }
}
