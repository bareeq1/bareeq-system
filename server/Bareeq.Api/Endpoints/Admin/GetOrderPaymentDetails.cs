using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Endpoints.Admin;

public class GetOrderPaymentDetails : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<AdminPaymentDetailsDto>
{
    private readonly AppDbContext _dbContext;

    public GetOrderPaymentDetails(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("admin/orders/{orderId:guid}/payment")]
    [Authorize(Roles = "Admin")]
    public override async Task<ActionResult<AdminPaymentDetailsDto>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var orderId = Guid.Parse((string)RouteData.Values["orderId"]!);

        var payment = await _dbContext.OrderPayments
            .AsNoTracking()
            .Include(p => p.Order).ThenInclude(o => o!.User)
            .Include(p => p.Order).ThenInclude(o => o!.Branch)
            .FirstOrDefaultAsync(p => p.OrderId == orderId, cancellationToken);

        if (payment is null)
            return NotFound();

        var order = payment.Order!;

        return Ok(new AdminPaymentDetailsDto
        {
            PaymentId = payment.Id,
            ImageUrl = payment.ImageUrl,
            Status = payment.Status,
            SubmittedAt = payment.SubmittedAt,
            Order = new AdminOrderSummaryDto
            {
                OrderId = order.Id,
                CustomerName = order.User?.FullName ?? string.Empty,
                CustomerEmail = order.User?.Email ?? string.Empty,
                BranchLabel = order.Branch?.Label ?? order.BranchId ?? string.Empty,
                DeliveryMethod = order.DeliveryMethod,
                Status = order.Status,
                PaymentStatus = payment.Status,
                CreatedAt = order.CreatedAt,
                Total = order.Subtotal + order.DeliveryFee
            }
        });
    }
}
