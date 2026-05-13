using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Addresses;

public class CreateAddress : EndpointBaseAsync
    .WithRequest<AddressCreateRequest>
    .WithActionResult<AddressDto>
{
    private readonly AppDbContext _dbContext;

    public CreateAddress(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("addresses")]
    [Authorize]
    public override async Task<ActionResult<AddressDto>> HandleAsync(AddressCreateRequest request, CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(request.Label) || string.IsNullOrWhiteSpace(request.Detail))
        {
            return BadRequest("Label and detail are required.");
        }

        if (request.IsPrimary)
        {
            var existingPrimary = await _dbContext.Addresses.Where(address => address.UserId == userId && address.IsPrimary).ToListAsync(cancellationToken);
            foreach (var address in existingPrimary)
            {
                address.IsPrimary = false;
                address.UpdatedAt = DateTimeOffset.UtcNow;
            }
        }

        var addressEntity = new Address
        {
            UserId = userId,
            Label = request.Label.Trim(),
            Detail = request.Detail.Trim(),
            IsPrimary = request.IsPrimary
        };

        _dbContext.Addresses.Add(addressEntity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new AddressDto
        {
            Id = addressEntity.Id,
            Label = addressEntity.Label,
            Detail = addressEntity.Detail,
            IsPrimary = addressEntity.IsPrimary
        });
    }
}
