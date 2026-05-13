namespace Bareeq.Api.Models;

public class ItemDto
{
    public string Id { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Price { get; set; }
    public string Tone { get; set; } = string.Empty;
    public string? Flag { get; set; }
    public int? Calories { get; set; }
    public int SortOrder { get; set; }
}
