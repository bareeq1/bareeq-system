using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class GetOrders : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<OrderDto>>
{
    private readonly AppDbContext _dbContext;

    public GetOrders(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("orders")]
    [Authorize]
    public override async Task<ActionResult<List<OrderDto>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var orders = await _dbContext.Orders
            .AsNoTracking()
            .Include(order => order.Items)
            .ThenInclude(item => item.Addons)
            .Where(order => order.UserId == userId)
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync(cancellationToken);

        var itemIds = orders.SelectMany(order => order.Items.Select(item => item.ItemId)).Distinct().ToList();
        var items = await _dbContext.Items
            .AsNoTracking()
            .Where(item => itemIds.Contains(item.Id))
            .ToListAsync(cancellationToken);

        var response = orders.Select(order => new OrderDto
        {
            Id = order.Id,
            CreatedAt = order.CreatedAt,
            Status = order.Status,
            Subtotal = order.Subtotal,
            Points = order.Points,
            Items = order.Items.Select(orderItem =>
            {
                var item = items.First(i => i.Id == orderItem.ItemId);
                return new OrderItemDto
                {
                    ItemId = orderItem.ItemId,
                    NameEn = item.NameEn,
                    NameAr = item.NameAr,
                    SizeId = orderItem.SizeId,
                    MilkId = orderItem.MilkId,
                    AddonIds = orderItem.Addons.Select(addon => addon.AddonId).ToList(),
                    Notes = orderItem.Notes,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    LineTotal = orderItem.LineTotal
                };
            }).ToList()
        }).ToList();

        return Ok(response);
    }
}
