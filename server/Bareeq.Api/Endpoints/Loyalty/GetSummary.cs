using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Loyalty;

public class GetSummary : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<LoyaltySummaryDto>
{
    private readonly AppDbContext _dbContext;

    public GetSummary(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("loyalty/summary")]
    [Authorize]
    public override async Task<ActionResult<LoyaltySummaryDto>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        var tiers = await _dbContext.Tiers
            .AsNoTracking()
            .Include(tier => tier.Perks)
            .OrderBy(tier => tier.SortOrder)
            .ToListAsync(cancellationToken);

        var badges = await _dbContext.Badges
            .AsNoTracking()
            .OrderBy(badge => badge.SortOrder)
            .ToListAsync(cancellationToken);

        var userBadges = await _dbContext.UserBadges
            .AsNoTracking()
            .Where(ub => ub.UserId == userId)
            .ToListAsync(cancellationToken);

        var coupons = await _dbContext.Coupons
            .AsNoTracking()
            .OrderBy(coupon => coupon.SortOrder)
            .ToListAsync(cancellationToken);

        var userCoupons = await _dbContext.UserCoupons
            .AsNoTracking()
            .Where(uc => uc.UserId == userId)
            .ToListAsync(cancellationToken);

        var tier = tiers.LastOrDefault(t => user.Sparkles >= t.MinPoints && user.Sparkles < t.MaxPoints) ?? tiers.First();
        var tierIndex = tiers.IndexOf(tier);
        var nextTier = tierIndex + 1 < tiers.Count ? tiers[tierIndex + 1] : null;
        var pointsToNext = nextTier == null ? 0 : Math.Max(0, nextTier.MinPoints - user.Sparkles);
        var progressPercent = tier.MaxPoints > tier.MinPoints
            ? (user.Sparkles - tier.MinPoints) / (double)(tier.MaxPoints - tier.MinPoints) * 100d
            : 0d;

        var response = new LoyaltySummaryDto
        {
            Points = user.Sparkles,
            TierId = tier.Id,
            NextTierId = nextTier?.Id,
            PointsToNextTier = pointsToNext,
            ProgressPercent = Math.Clamp(progressPercent, 0d, 100d),
            StreakCount = user.StreakCount,
            Tiers = tiers.Select(t => new TierDto
            {
                Id = t.Id,
                Label = t.Label,
                MinPoints = t.MinPoints,
                MaxPoints = t.MaxPoints,
                Perks = t.Perks.OrderBy(perk => perk.SortOrder).Select(perk => perk.Text).ToList()
            }).ToList(),
            Badges = badges.Select(badge => new BadgeDto
            {
                Id = badge.Id,
                Label = badge.Label,
                Description = badge.Description,
                Glyph = badge.Glyph,
                Earned = userBadges.Any(ub => ub.BadgeId == badge.Id && ub.Earned)
            }).ToList(),
            Coupons = coupons.Select(coupon => new CouponDto
            {
                Id = coupon.Id,
                Label = coupon.Label,
                Description = coupon.Description,
                ExpiryText = coupon.ExpiryText,
                Flavor = coupon.Flavor,
                Redeemed = userCoupons.Any(uc => uc.CouponId == coupon.Id && uc.Redeemed)
            }).ToList()
        };

        return Ok(response);
    }
}
