using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Hubs;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class CheckoutOrder : EndpointBaseAsync
    .WithRequest<CheckoutRequest>
    .WithActionResult<CheckoutResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<OrderHub> _hub;

    public CheckoutOrder(AppDbContext dbContext, IHubContext<OrderHub> hub)
    {
        _dbContext = dbContext;
        _hub = hub;
    }

    [HttpPost("orders/checkout")]
    [Authorize]
    public override async Task<ActionResult<CheckoutResponse>> HandleAsync(CheckoutRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Items.Count == 0)
            return BadRequest("Order must contain at least one item.");

        var validMethods = new[] { "Pickup", "Delivery" };
        if (!validMethods.Contains(request.DeliveryMethod))
            return BadRequest("DeliveryMethod must be Pickup or Delivery.");

        if (request.DeliveryMethod == "Delivery" && string.IsNullOrWhiteSpace(request.DeliveryAddress))
            return BadRequest("DeliveryAddress is required for Delivery orders.");

        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
            return Unauthorized();

        var branch = await _dbContext.Branches.FirstOrDefaultAsync(b => b.Id == request.BranchId, cancellationToken);
        if (branch is null)
            return BadRequest("Invalid branch.");

        var itemIds = request.Items.Select(i => i.ItemId).ToArray();
        var sizeIds = request.Items.Select(i => i.SizeId).Distinct().ToArray();
        var milkIds = request.Items.Select(i => i.MilkId).Distinct().ToArray();
        var addonIds = request.Items.SelectMany(i => i.AddonIds ?? new List<string>()).Distinct().ToArray();

        var items = await _dbContext.Items.Where(i => itemIds.Contains(i.Id)).ToListAsync(cancellationToken);
        var sizes = await _dbContext.Sizes.Where(s => sizeIds.Contains(s.Id)).ToListAsync(cancellationToken);
        var milks = await _dbContext.Milks.Where(m => milkIds.Contains(m.Id)).ToListAsync(cancellationToken);
        var addons = await _dbContext.Addons.Where(a => addonIds.Contains(a.Id)).ToListAsync(cancellationToken);

        if (items.Count != itemIds.Length)
            return BadRequest("One or more items are invalid.");
        if (sizes.Count != sizeIds.Length || milks.Count != milkIds.Length)
            return BadRequest("One or more size or milk options are invalid.");
        if (addonIds.Length > 0 && addons.Count != addonIds.Length)
            return BadRequest("One or more add-ons are invalid.");

        var deliveryFee = request.DeliveryMethod == "Delivery" ? 5000 : 0;

        var order = new Order
        {
            UserId = userId,
            Status = "Placed",
            Source = "Online",
            BranchId = branch.Id,
            DeliveryMethod = request.DeliveryMethod,
            DeliveryAddress = request.DeliveryAddress,
            DeliveryFee = deliveryFee
        };

        foreach (var line in request.Items)
        {
            var item = items.First(i => i.Id == line.ItemId);
            var size = sizes.FirstOrDefault(s => s.Id == line.SizeId);
            var milk = milks.FirstOrDefault(m => m.Id == line.MilkId);
            if (size is null || milk is null)
                return BadRequest("Invalid size or milk option.");

            var lineAddons = line.AddonIds ?? new List<string>();
            var addonEntities = addons.Where(a => lineAddons.Contains(a.Id)).ToList();
            var addonTotal = addonEntities.Sum(a => a.Price);
            var unitPrice = item.Price + size.Delta + milk.Delta + addonTotal;
            var quantity = Math.Max(1, line.Quantity);

            var orderItem = new OrderItem
            {
                ItemId = item.Id,
                SizeId = size.Id,
                MilkId = milk.Id,
                Notes = line.Notes,
                Quantity = quantity,
                UnitPrice = unitPrice,
                LineTotal = unitPrice * quantity
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

        order.Subtotal = order.Items.Sum(i => i.LineTotal);
        order.Points = (int)Math.Floor(order.Subtotal / 10m);

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _hub.Clients.Group($"branch-{order.BranchId}")
            .SendAsync("OrderCreated", new { orderId = order.Id }, cancellationToken);

        return Ok(new CheckoutResponse
        {
            OrderId = order.Id,
            Subtotal = order.Subtotal,
            DeliveryFee = order.DeliveryFee,
            Total = order.Subtotal + order.DeliveryFee,
            BranchId = branch.Id,
            BranchLabel = branch.Label,
            DeliveryMethod = order.DeliveryMethod,
            Status = order.Status
        });
    }
}
