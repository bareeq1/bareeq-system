using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class ConfirmBranchPayment : EndpointBaseAsync
    .WithRequest<ConfirmPaymentRequest>
    .WithActionResult<ConfirmPaymentResponse>
{
    private readonly AppDbContext _dbContext;

    public ConfirmBranchPayment(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("orders/{orderId:guid}/confirm-payment")]
    [Authorize(Roles = "BranchStaff")]
    public override async Task<ActionResult<ConfirmPaymentResponse>> HandleAsync(ConfirmPaymentRequest request, CancellationToken cancellationToken = default)
    {
        var validPaymentMethods = new[] { "Cash", "Card" };
        if (!validPaymentMethods.Contains(request.PaymentMethod))
            return BadRequest("PaymentMethod must be Cash or Card.");

        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var staffId))
            return Unauthorized();

        var staff = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == staffId, cancellationToken);
        if (staff is null)
            return Unauthorized();

        var orderId = Guid.Parse((string)RouteData.Values["orderId"]!);

        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
        if (order is null)
            return NotFound();

        if (order.BranchId != staff.BranchId)
            return Forbid();

        if (order.Status != "Placed")
            return BadRequest("Only orders in Placed status can be confirmed.");

        order.Status = "Confirmed";
        order.PaymentMethod = request.PaymentMethod;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new ConfirmPaymentResponse
        {
            OrderId = order.Id,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod
        });
    }
}
