namespace Bareeq.Api.Entities;

public class UserCoupon
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string CouponId { get; set; } = string.Empty;
    public Coupon? Coupon { get; set; }

    public bool Redeemed { get; set; }
    public DateTimeOffset? RedeemedAt { get; set; }
}
