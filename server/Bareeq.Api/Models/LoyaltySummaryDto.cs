namespace Bareeq.Api.Models;

public class LoyaltySummaryDto
{
    public int Points { get; set; }
    public string TierId { get; set; } = string.Empty;
    public string? NextTierId { get; set; }
    public int PointsToNextTier { get; set; }
    public double ProgressPercent { get; set; }
    public int StreakCount { get; set; }

    public List<TierDto> Tiers { get; set; } = new();
    public List<BadgeDto> Badges { get; set; } = new();
    public List<CouponDto> Coupons { get; set; } = new();
}
