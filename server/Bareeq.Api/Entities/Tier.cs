namespace Bareeq.Api.Entities;

public class Tier
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int MinPoints { get; set; }
    public int MaxPoints { get; set; }
    public int SortOrder { get; set; }

    public List<TierPerk> Perks { get; set; } = new();
}
