using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class CreateBranchOrder : EndpointBaseAsync
    .WithRequest<BranchOrderRequest>
    .WithActionResult<CheckoutResponse>
{
    private readonly AppDbContext _dbContext;

    public CreateBranchOrder(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("orders/branch")]
    [Authorize(Roles = "BranchStaff")]
    public override async Task<ActionResult<CheckoutResponse>> HandleAsync(BranchOrderRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Items.Count == 0)
            return BadRequest("Order must contain at least one item.");

        var validPaymentMethods = new[] { "Cash", "Card" };
        if (!validPaymentMethods.Contains(request.PaymentMethod))
            return BadRequest("PaymentMethod must be Cash or Card.");

        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
            return Unauthorized();

        var staff = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (staff is null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(staff.BranchId))
            return BadRequest("Staff account is not assigned to a branch.");

        var branch = await _dbContext.Branches.FirstOrDefaultAsync(b => b.Id == staff.BranchId, cancellationToken);
        if (branch is null)
            return BadRequest("Staff account has an invalid branch assignment.");

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

        var order = new Order
        {
            UserId = userId,
            Status = "Confirmed",
            Source = "Branch",
            BranchId = branch.Id,
            DeliveryMethod = "Pickup",
            DeliveryFee = 0,
            PaymentMethod = request.PaymentMethod
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

        var user = await _dbContext.Users.FindAsync([userId], cancellationToken);
        if (user is not null)
        {
            user.Sparkles += order.Points;
        }

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new CheckoutResponse
        {
            OrderId = order.Id,
            Subtotal = order.Subtotal,
            DeliveryFee = 0,
            Total = order.Subtotal,
            BranchId = branch.Id,
            BranchLabel = branch.Label,
            DeliveryMethod = "Pickup",
            Status = order.Status
        });
    }
}
