using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Addresses;

public class GetAddresses : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<AddressDto>>
{
    private readonly AppDbContext _dbContext;

    public GetAddresses(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("addresses")]
    [Authorize]
    public override async Task<ActionResult<List<AddressDto>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var addresses = await _dbContext.Addresses
            .AsNoTracking()
            .Where(address => address.UserId == userId)
            .OrderByDescending(address => address.IsPrimary)
            .ThenBy(address => address.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(addresses.Select(address => new AddressDto
        {
            Id = address.Id,
            Label = address.Label,
            Detail = address.Detail,
            IsPrimary = address.IsPrimary
        }).ToList());
    }
}
