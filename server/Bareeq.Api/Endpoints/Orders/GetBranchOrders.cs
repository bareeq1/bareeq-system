using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class GetBranchOrders : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<AdminOrderSummaryDto>>
{
    private readonly AppDbContext _dbContext;

    public GetBranchOrders(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("orders/branch-staff")]
    [Authorize(Roles = "BranchStaff")]
    public override async Task<ActionResult<List<AdminOrderSummaryDto>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var staffId))
            return Unauthorized();

        var staff = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == staffId, cancellationToken);
        if (staff is null || string.IsNullOrWhiteSpace(staff.BranchId))
            return Unauthorized();

        var statusFilter = Request.Query["status"].FirstOrDefault();
        var page = int.TryParse(Request.Query["page"], out var p) ? Math.Max(1, p) : 1;
        var pageSize = int.TryParse(Request.Query["pageSize"], out var ps) ? Math.Clamp(ps, 1, 100) : 50;

        var query = _dbContext.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.Branch)
            .Where(o => o.BranchId == staff.BranchId)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(statusFilter))
            query = query.Where(o => o.Status == statusFilter);

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
