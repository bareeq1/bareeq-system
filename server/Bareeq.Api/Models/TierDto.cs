namespace Bareeq.Api.Models;

public class TierDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int MinPoints { get; set; }
    public int MaxPoints { get; set; }
    public List<string> Perks { get; set; } = new();
}
