namespace Bareeq.Api.Models;

public class BadgeDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Glyph { get; set; } = string.Empty;
    public bool Earned { get; set; }
}
