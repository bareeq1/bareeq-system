using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Addresses;

public class UpdateAddress : EndpointBaseAsync
    .WithRequest<AddressUpdateRequest>
    .WithActionResult<AddressDto>
{
    private readonly AppDbContext _dbContext;

    public UpdateAddress(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPut("addresses/{addressId:guid}")]
    [Authorize]
    public override async Task<ActionResult<AddressDto>> HandleAsync([FromRoute] Guid addressId, AddressUpdateRequest request, CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var address = await _dbContext.Addresses.FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId, cancellationToken);
        if (address is null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(request.Label) || string.IsNullOrWhiteSpace(request.Detail))
        {
            return BadRequest("Label and detail are required.");
        }

        if (request.IsPrimary)
        {
            var existingPrimary = await _dbContext.Addresses.Where(a => a.UserId == userId && a.IsPrimary && a.Id != addressId).ToListAsync(cancellationToken);
            foreach (var item in existingPrimary)
            {
                item.IsPrimary = false;
                item.UpdatedAt = DateTimeOffset.UtcNow;
            }
        }

        address.Label = request.Label.Trim();
        address.Detail = request.Detail.Trim();
        address.IsPrimary = request.IsPrimary;
        address.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new AddressDto
        {
            Id = address.Id,
            Label = address.Label,
            Detail = address.Detail,
            IsPrimary = address.IsPrimary
        });
    }
}
