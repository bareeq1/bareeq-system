namespace Bareeq.Api.Entities;

public class Badge
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Glyph { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    public List<UserBadge> UserBadges { get; set; } = new();
}
