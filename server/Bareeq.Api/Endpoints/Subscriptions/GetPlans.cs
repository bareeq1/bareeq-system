using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Endpoints.Subscriptions;

public class GetPlans : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<SubscriptionPlanDto>>
{
    private readonly AppDbContext _dbContext;

    public GetPlans(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("subscriptions/plans")]
    [AllowAnonymous]
    public override async Task<ActionResult<List<SubscriptionPlanDto>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var plans = await _dbContext.SubscriptionPlans
            .AsNoTracking()
            .Include(plan => plan.Perks)
            .OrderBy(plan => plan.SortOrder)
            .ToListAsync(cancellationToken);

        var response = plans.Select(plan => new SubscriptionPlanDto
        {
            Id = plan.Id,
            Label = plan.Label,
            Price = plan.Price,
            Description = plan.Description,
            Perks = plan.Perks.OrderBy(perk => perk.SortOrder).Select(perk => perk.Text).ToList()
        }).ToList();

        return Ok(response);
    }
}
