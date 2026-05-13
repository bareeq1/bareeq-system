namespace Bareeq.Api.Entities;

public class TierPerk
{
    public int Id { get; set; }
    public string TierId { get; set; } = string.Empty;
    public Tier? Tier { get; set; }
    public string Text { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
