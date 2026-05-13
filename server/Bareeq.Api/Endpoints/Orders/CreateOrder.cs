using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class CreateOrder : EndpointBaseAsync
    .WithRequest<OrderCreateRequest>
    .WithActionResult<OrderDto>
{
    private readonly AppDbContext _dbContext;

    public CreateOrder(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("orders")]
    [Authorize]
    public override async Task<ActionResult<OrderDto>> HandleAsync(OrderCreateRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Items.Count == 0)
        {
            return BadRequest("Order must contain at least one item.");
        }

        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var itemIds = request.Items.Select(item => item.ItemId).ToArray();
        var sizeIds = request.Items.Select(item => item.SizeId).Distinct().ToArray();
        var milkIds = request.Items.Select(item => item.MilkId).Distinct().ToArray();
        var addonIds = request.Items.SelectMany(item => item.AddonIds ?? new List<string>()).Distinct().ToArray();

        var items = await _dbContext.Items.Where(item => itemIds.Contains(item.Id)).ToListAsync(cancellationToken);
        var sizes = await _dbContext.Sizes.Where(size => sizeIds.Contains(size.Id)).ToListAsync(cancellationToken);
        var milks = await _dbContext.Milks.Where(milk => milkIds.Contains(milk.Id)).ToListAsync(cancellationToken);
        var addons = await _dbContext.Addons.Where(addon => addonIds.Contains(addon.Id)).ToListAsync(cancellationToken);

        if (items.Count != itemIds.Length)
        {
            return BadRequest("One or more items are invalid.");
        }

        if (sizes.Count != sizeIds.Length || milks.Count != milkIds.Length)
        {
            return BadRequest("One or more size or milk options are invalid.");
        }

        if (addonIds.Length > 0 && addons.Count != addonIds.Length)
        {
            return BadRequest("One or more add-ons are invalid.");
        }

        var order = new Order
        {
            UserId = userId,
            Status = "Placed"
        };

        foreach (var line in request.Items)
        {
            var item = items.First(i => i.Id == line.ItemId);
            var size = sizes.FirstOrDefault(s => s.Id == line.SizeId);
            var milk = milks.FirstOrDefault(m => m.Id == line.MilkId);
            if (size is null || milk is null)
            {
                return BadRequest("Invalid size or milk option.");
            }

            var lineAddons = line.AddonIds ?? new List<string>();
            var addonEntities = addons.Where(a => lineAddons.Contains(a.Id)).ToList();
            var addonTotal = addonEntities.Sum(a => a.Price);
            var unitPrice = item.Price + size.Delta + milk.Delta + addonTotal;
            var quantity = Math.Max(1, line.Quantity);
            var lineTotal = unitPrice * quantity;

            var orderItem = new OrderItem
            {
                ItemId = item.Id,
                SizeId = size.Id,
                MilkId = milk.Id,
                Notes = line.Notes,
                Quantity = quantity,
                UnitPrice = unitPrice,
                LineTotal = lineTotal
            };

            foreach (var addon in addonEntities)
            {
                orderItem.Addons.Add(new OrderItemAddon
                {
                    AddonId = addon.Id,
                    AddonLabel = addon.Label,
                    AddonPrice = addon.Price
                });
            }

            order.Items.Add(orderItem);
        }

        order.Subtotal = order.Items.Sum(orderItem => orderItem.LineTotal);
        order.Points = (int)Math.Floor(order.Subtotal / 10m);

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        user.Sparkles += order.Points;
        user.UpdatedAt = DateTimeOffset.UtcNow;

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new OrderDto
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
                    AddonIds = orderItem.Addons.Select(a => a.AddonId).ToList(),
                    Notes = orderItem.Notes,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    LineTotal = orderItem.LineTotal
                };
            }).ToList()
        };

        return Ok(response);
    }
}
