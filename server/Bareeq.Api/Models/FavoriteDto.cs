namespace Bareeq.Api.Models;

public class FavoriteDto
{
    public string ItemId { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public int Price { get; set; }
    public string Tone { get; set; } = string.Empty;
}
