namespace Bareeq.Api.Models;

public class SubscriptionPlanDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<string> Perks { get; set; } = new();
}
