using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Favorites;

public class GetFavorites : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<FavoriteDto>>
{
    private readonly AppDbContext _dbContext;

    public GetFavorites(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("favorites")]
    [Authorize]
    public override async Task<ActionResult<List<FavoriteDto>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var favorites = await _dbContext.UserFavorites
            .AsNoTracking()
            .Where(favorite => favorite.UserId == userId)
            .Include(favorite => favorite.Item)
            .ToListAsync(cancellationToken);

        return Ok(favorites
            .Where(favorite => favorite.Item != null)
            .Select(favorite => new FavoriteDto
            {
                ItemId = favorite.ItemId,
                NameEn = favorite.Item!.NameEn,
                NameAr = favorite.Item!.NameAr,
                Price = favorite.Item!.Price,
                Tone = favorite.Item!.Tone
            })
            .ToList());
    }
}
