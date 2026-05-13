using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Favorites;

public class AddFavorite : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<FavoriteDto>
{
    private readonly AppDbContext _dbContext;

    public AddFavorite(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("favorites/{itemId}")]
    [Authorize]
    public override async Task<ActionResult<FavoriteDto>> HandleAsync([FromRoute] string itemId, CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var item = await _dbContext.Items.AsNoTracking().FirstOrDefaultAsync(i => i.Id == itemId, cancellationToken);
        if (item is null)
        {
            return NotFound();
        }

        var exists = await _dbContext.UserFavorites.AnyAsync(f => f.UserId == userId && f.ItemId == itemId, cancellationToken);
        if (!exists)
        {
            _dbContext.UserFavorites.Add(new UserFavorite
            {
                UserId = userId,
                ItemId = itemId
            });
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(new FavoriteDto
        {
            ItemId = item.Id,
            NameEn = item.NameEn,
            NameAr = item.NameAr,
            Price = item.Price,
            Tone = item.Tone
        });
    }
}
