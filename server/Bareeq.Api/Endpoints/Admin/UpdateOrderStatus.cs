using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Bareeq.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Endpoints.Admin;

public class UpdateOrderStatus : EndpointBaseAsync
    .WithRequest<UpdateOrderStatusRequest>
    .WithActionResult<OrderStatusUpdateResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly IEmailService _emailService;

    public UpdateOrderStatus(AppDbContext dbContext, IEmailService emailService)
    {
        _dbContext = dbContext;
        _emailService = emailService;
    }

    [HttpPut("orders/{orderId:guid}/status")]
    [Authorize(Roles = "Admin")]
    public override async Task<ActionResult<OrderStatusUpdateResponse>> HandleAsync(UpdateOrderStatusRequest request, CancellationToken cancellationToken = default)
    {
        var orderId = Guid.Parse((string)RouteData.Values["orderId"]!);

        var validStatuses = new[] { "Confirmed", "Ready", "Completed" };
        if (!validStatuses.Contains(request.Status))
            return BadRequest($"Status must be one of: {string.Join(", ", validStatuses)}.");

        var order = await _dbContext.Orders
            .Include(o => o.User)
            .Include(o => o.Branch)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
            return NotFound();

        order.Status = request.Status;
        await _dbContext.SaveChangesAsync(cancellationToken);

        var customer = order.User!;
        var branchLabel = order.Branch?.Label ?? string.Empty;

        switch (request.Status)
        {
            case "Ready":
                await _emailService.SendOrderReadyAsync(customer.Email, customer.FullName, order.Id, branchLabel, order.DeliveryMethod, cancellationToken);
                break;
            case "Completed":
                await _emailService.SendOrderCompletedAsync(customer.Email, customer.FullName, order.Id, cancellationToken);
                break;
        }

        return Ok(new OrderStatusUpdateResponse
        {
            OrderId = order.Id,
            NewStatus = order.Status,
            Message = $"Order status updated to {order.Status}."
        });
    }
}
