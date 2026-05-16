using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class GetPendingOrders : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<PendingOrderDto>>
{
    private readonly AppDbContext _dbContext;

    public GetPendingOrders(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("orders/pending")]
    [Authorize(Roles = "BranchStaff")]
    public override async Task<ActionResult<List<PendingOrderDto>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var staffId))
            return Unauthorized();

        var staff = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == staffId, cancellationToken);
        if (staff is null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(staff.BranchId))
            return BadRequest("Staff account is not assigned to a branch.");

        var orders = await _dbContext.Orders
            .Where(o => o.BranchId == staff.BranchId && (o.Status == "Placed" || o.Status == "Confirmed"))
            .Include(o => o.Items)
                .ThenInclude(i => i.Item)
            .Include(o => o.Items)
                .ThenInclude(i => i.Addons)
            .OrderBy(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        var result = orders.Select(o => new PendingOrderDto
        {
            Id = o.Id,
            Source = o.Source,
            PaymentMethod = o.PaymentMethod,
            CreatedAt = o.CreatedAt,
            Items = o.Items.Select(i => new PendingOrderItemDto
            {
                Id = i.Id,
                ItemId = i.ItemId,
                NameEn = i.Item?.NameEn ?? string.Empty,
                NameAr = i.Item?.NameAr ?? string.Empty,
                SizeId = i.SizeId,
                MilkId = i.MilkId,
                AddonIds = i.Addons.Select(a => a.AddonId).ToList(),
                Notes = i.Notes,
                Quantity = i.Quantity,
                KdsStatus = i.KdsStatus
            }).ToList()
        }).ToList();

        return Ok(result);
    }
}
