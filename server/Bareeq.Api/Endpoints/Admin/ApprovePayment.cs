using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Hubs;
using Bareeq.Api.Models;
using Bareeq.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Admin;

public class ApprovePayment : EndpointBaseAsync
    .WithRequest<ApprovePaymentRequest>
    .WithActionResult<PaymentApprovalResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly IEmailService _emailService;
    private readonly IHubContext<OrderHub> _hub;

    public ApprovePayment(AppDbContext dbContext, IEmailService emailService, IHubContext<OrderHub> hub)
    {
        _dbContext = dbContext;
        _emailService = emailService;
        _hub = hub;
    }

    [HttpPut("orders/{orderId:guid}/payment/{paymentId:guid}/approve")]
    [Authorize(Roles = "Admin")]
    public override async Task<ActionResult<PaymentApprovalResponse>> HandleAsync(ApprovePaymentRequest request, CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var reviewerId))
            return Unauthorized();

        var orderId = Guid.Parse((string)RouteData.Values["orderId"]!);
        var paymentId = Guid.Parse((string)RouteData.Values["paymentId"]!);

        var payment = await _dbContext.OrderPayments
            .Include(p => p.Order).ThenInclude(o => o!.User)
            .Include(p => p.Order).ThenInclude(o => o!.Branch)
            .FirstOrDefaultAsync(p => p.Id == paymentId && p.OrderId == orderId, cancellationToken);

        if (payment is null)
            return NotFound();

        if (payment.Status != "Pending")
            return BadRequest("This payment has already been reviewed.");

        payment.ReviewedAt = DateTimeOffset.UtcNow;
        payment.ReviewedBy = reviewerId;

        if (request.Approved)
        {
            payment.Status = "Approved";
            payment.Order!.Status = "Confirmed";

            await _dbContext.SaveChangesAsync(cancellationToken);

            var customer = payment.Order.User!;
            await _emailService.SendOrderConfirmedAsync(
                customer.Email,
                customer.FullName,
                payment.Order.Id,
                payment.Order.Subtotal + payment.Order.DeliveryFee,
                payment.Order.Branch?.Label ?? string.Empty,
                payment.Order.DeliveryMethod,
                cancellationToken);

            if (!string.IsNullOrWhiteSpace(payment.Order.BranchId))
            {
                await _hub.Clients.Group($"branch-{payment.Order.BranchId}")
                    .SendAsync("OrderCreated", new { orderId = payment.Order.Id }, cancellationToken);
            }

            return Ok(new PaymentApprovalResponse
            {
                OrderId = payment.OrderId,
                Status = "Confirmed",
                Message = "Payment approved. Order is now confirmed."
            });
        }
        else
        {
            if (string.IsNullOrWhiteSpace(request.RejectionReason))
                return BadRequest("A rejection reason is required when rejecting a payment.");

            payment.Status = "Rejected";
            payment.RejectionReason = request.RejectionReason;
            payment.Order!.Status = "Placed";

            await _dbContext.SaveChangesAsync(cancellationToken);

            var customer = payment.Order.User!;
            await _emailService.SendPaymentRejectedAsync(
                customer.Email,
                customer.FullName,
                payment.Order.Id,
                request.RejectionReason,
                cancellationToken);

            return Ok(new PaymentApprovalResponse
            {
                OrderId = payment.OrderId,
                Status = "Placed",
                Message = "Payment rejected. Customer has been notified."
            });
        }
    }
}
