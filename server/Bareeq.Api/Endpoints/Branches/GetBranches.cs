using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Endpoints.Branches;

public class GetBranches : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<BranchDto>>
{
    private readonly AppDbContext _dbContext;

    public GetBranches(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("branches")]
    public override async Task<ActionResult<List<BranchDto>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var branches = await _dbContext.Branches
            .AsNoTracking()
            .OrderBy(branch => branch.Label)
            .ToListAsync(cancellationToken);

        var result = branches.Select(branch => new BranchDto
        {
            Id = branch.Id,
            Label = branch.Label,
            Address = branch.Address,
            Phone = branch.Phone,
            Hours = branch.Hours,
            Latitude = branch.Latitude,
            Longitude = branch.Longitude
        }).ToList();

        return Ok(result);
    }
}
