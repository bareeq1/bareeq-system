using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Endpoints.Admin;

public class GetOrders : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<AdminOrderSummaryDto>>
{
    private readonly AppDbContext _dbContext;

    public GetOrders(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("admin/orders")]
    [Authorize(Roles = "Admin")]
    public override async Task<ActionResult<List<AdminOrderSummaryDto>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var statusFilter = Request.Query["status"].FirstOrDefault();
        var branchFilter = Request.Query["branch"].FirstOrDefault();
        var page = int.TryParse(Request.Query["page"], out var p) ? Math.Max(1, p) : 1;
        var pageSize = int.TryParse(Request.Query["pageSize"], out var ps) ? Math.Clamp(ps, 1, 100) : 20;

        var query = _dbContext.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.Branch)
            .Include(o => o.Payment)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(statusFilter))
            query = query.Where(o => o.Status == statusFilter);

        if (!string.IsNullOrWhiteSpace(branchFilter))
            query = query.Where(o => o.BranchId == branchFilter);

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var result = orders.Select(o => new AdminOrderSummaryDto
        {
            OrderId = o.Id,
            CustomerName = o.User?.FullName ?? string.Empty,
            CustomerEmail = o.User?.Email ?? string.Empty,
            BranchLabel = o.Branch?.Label ?? o.BranchId ?? string.Empty,
            DeliveryMethod = o.DeliveryMethod,
            Status = o.Status,
            PaymentStatus = o.Payment?.Status,
            CreatedAt = o.CreatedAt,
            Total = o.Subtotal + o.DeliveryFee
        }).ToList();

        return Ok(result);
    }
}
