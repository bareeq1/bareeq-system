using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Loyalty;

public class ClaimStreak : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<StreakResponse>
{
    private readonly AppDbContext _dbContext;

    public ClaimStreak(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("loyalty/streak")]
    [Authorize]
    public override async Task<ActionResult<StreakResponse>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var last = user.LastStreakAt.HasValue ? DateOnly.FromDateTime(user.LastStreakAt.Value.UtcDateTime) : (DateOnly?)null;

        if (last == today)
        {
            return BadRequest("Streak already claimed today.");
        }

        if (last.HasValue && last.Value.AddDays(1) == today)
        {
            user.StreakCount += 1;
        }
        else
        {
            user.StreakCount = 1;
        }

        user.LastStreakAt = DateTimeOffset.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new StreakResponse
        {
            StreakCount = user.StreakCount
        });
    }
}
