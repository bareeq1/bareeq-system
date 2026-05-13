namespace Bareeq.Api.Models;

public class CouponDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ExpiryText { get; set; } = string.Empty;
    public string Flavor { get; set; } = string.Empty;
    public bool Redeemed { get; set; }
}
