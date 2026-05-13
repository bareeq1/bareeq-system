namespace Bareeq.Api.Entities;

public class SubscriptionPerk
{
    public int Id { get; set; }
    public string PlanId { get; set; } = string.Empty;
    public SubscriptionPlan? Plan { get; set; }
    public string Text { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
