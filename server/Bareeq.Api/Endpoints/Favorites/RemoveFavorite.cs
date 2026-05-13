using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Favorites;

public class RemoveFavorite : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult
{
    private readonly AppDbContext _dbContext;

    public RemoveFavorite(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpDelete("favorites/{itemId}")]
    [Authorize]
    public override async Task<ActionResult> HandleAsync([FromRoute] string itemId, CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var favorite = await _dbContext.UserFavorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ItemId == itemId, cancellationToken);
        if (favorite is null)
        {
            return NotFound();
        }

        _dbContext.UserFavorites.Remove(favorite);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
