namespace Bareeq.Api.Entities;

public class Coupon
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ExpiryText { get; set; } = string.Empty;
    public string Flavor { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    public List<UserCoupon> UserCoupons { get; set; } = new();
}
