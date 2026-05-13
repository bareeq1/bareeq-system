namespace Bareeq.Api.Entities;

public class SubscriptionPlan
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    public List<SubscriptionPerk> Perks { get; set; } = new();
}
