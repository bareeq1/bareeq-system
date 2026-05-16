using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Endpoints.Admin;

public class GetDashboard : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<AdminDashboardDto>
{
    private readonly AppDbContext _dbContext;

    public GetDashboard(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("admin/dashboard")]
    [Authorize(Roles = "Admin")]
    public override async Task<ActionResult<AdminDashboardDto>> HandleAsync(
        CancellationToken cancellationToken = default)
    {
        var period = Request.Query["period"].FirstOrDefault() ?? "day";
        var cutoff = ComputeCutoff(period);

        var orders = await _dbContext.Orders
            .AsNoTracking()
            .Where(o => o.CreatedAt >= cutoff)
            .Select(o => new { o.Subtotal, o.DeliveryFee })
            .ToListAsync(cancellationToken);

        var topBeverages = await _dbContext.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order!.CreatedAt >= cutoff)
            .GroupBy(oi => new { oi.ItemId, oi.Item!.NameEn, oi.Item.NameAr })
            .Select(g => new TopBeverageDto
            {
                ItemId = g.Key.ItemId,
                NameEn = g.Key.NameEn,
                NameAr = g.Key.NameAr,
                TotalQuantity = g.Sum(x => x.Quantity)
            })
            .OrderByDescending(x => x.TotalQuantity)
            .Take(5)
            .ToListAsync(cancellationToken);

        return Ok(new AdminDashboardDto
        {
            TotalOrders = orders.Count,
            TotalRevenue = orders.Sum(o => o.Subtotal + o.DeliveryFee),
            TopBeverages = topBeverages
        });
    }

    private static DateTimeOffset ComputeCutoff(string period) => period switch
    {
        "month" => new DateTimeOffset(DateTimeOffset.UtcNow.Year, DateTimeOffset.UtcNow.Month, 1, 0, 0, 0, TimeSpan.Zero),
        "year"  => new DateTimeOffset(DateTimeOffset.UtcNow.Year, 1, 1, 0, 0, 0, TimeSpan.Zero),
        _       => new DateTimeOffset(DateTimeOffset.UtcNow.Year, DateTimeOffset.UtcNow.Month, DateTimeOffset.UtcNow.Day, 0, 0, 0, TimeSpan.Zero)
    };
}
