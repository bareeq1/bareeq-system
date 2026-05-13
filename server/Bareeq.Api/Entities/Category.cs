namespace Bareeq.Api.Entities;

public class Category
{
    public string Id { get; set; } = string.Empty;
    public string LabelEn { get; set; } = string.Empty;
    public string LabelAr { get; set; } = string.Empty;
    public string Glyph { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    public List<Item> Items { get; set; } = new();
}
