namespace Bareeq.Api.Models;

public class CategoryDto
{
    public string Id { get; set; } = string.Empty;
    public string LabelEn { get; set; } = string.Empty;
    public string LabelAr { get; set; } = string.Empty;
    public string Glyph { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
