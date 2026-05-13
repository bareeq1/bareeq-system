using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Addresses;

public class DeleteAddress : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult
{
    private readonly AppDbContext _dbContext;

    public DeleteAddress(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpDelete("addresses/{addressId:guid}")]
    [Authorize]
    public override async Task<ActionResult> HandleAsync(CancellationToken cancellationToken = default)
    {
        var addressId = Guid.Parse((string)HttpContext.GetRouteValue("addressId")!);
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

        _dbContext.Addresses.Remove(address);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
