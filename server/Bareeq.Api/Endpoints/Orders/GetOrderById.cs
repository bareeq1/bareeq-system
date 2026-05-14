using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class GetOrderById : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<OrderDto>
{
    private readonly AppDbContext _dbContext;

    public GetOrderById(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("orders/{orderId:guid}")]
    [Authorize]
    public override async Task<ActionResult<OrderDto>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
            return Unauthorized();

        var orderId = Guid.Parse((string)RouteData.Values["orderId"]!);

        var order = await _dbContext.Orders
            .AsNoTracking()
            .Include(o => o.Items).ThenInclude(i => i.Addons)
            .Include(o => o.Branch)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
            return NotFound();

        var isAdmin = User.IsInRole("Admin");
        if (order.UserId != userId && !isAdmin)
            return Forbid();

        var itemIds = order.Items.Select(i => i.ItemId).Distinct().ToList();
        var items = await _dbContext.Items
            .AsNoTracking()
            .Where(i => itemIds.Contains(i.Id))
            .ToListAsync(cancellationToken);

        return Ok(MapOrderDto(order, items));
    }

    internal static OrderDto MapOrderDto(Bareeq.Api.Entities.Order order, List<Bareeq.Api.Entities.Item> items)
    {
        return new OrderDto
        {
            Id = order.Id,
            CreatedAt = order.CreatedAt,
            Status = order.Status,
            Source = order.Source,
            Subtotal = order.Subtotal,
            DeliveryFee = order.DeliveryFee,
            Total = order.Subtotal + order.DeliveryFee,
            Points = order.Points,
            BranchId = order.BranchId,
            BranchLabel = order.Branch?.Label,
            DeliveryMethod = order.DeliveryMethod,
            DeliveryAddress = order.DeliveryAddress,
            Payment = order.Payment is null ? null : new OrderPaymentDto
            {
                Id = order.Payment.Id,
                Status = order.Payment.Status,
                ImageUrl = order.Payment.ImageUrl,
                SubmittedAt = order.Payment.SubmittedAt,
                ReviewedAt = order.Payment.ReviewedAt,
                RejectionReason = order.Payment.RejectionReason
            },
            Items = order.Items.Select(orderItem =>
            {
                var item = items.FirstOrDefault(i => i.Id == orderItem.ItemId);
                return new OrderItemDto
                {
                    ItemId = orderItem.ItemId,
                    NameEn = item?.NameEn ?? string.Empty,
                    NameAr = item?.NameAr ?? string.Empty,
                    SizeId = orderItem.SizeId,
                    MilkId = orderItem.MilkId,
                    AddonIds = orderItem.Addons.Select(a => a.AddonId).ToList(),
                    Notes = orderItem.Notes,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    LineTotal = orderItem.LineTotal
                };
            }).ToList()
        };
    }
}
