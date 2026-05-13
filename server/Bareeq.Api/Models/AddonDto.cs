namespace Bareeq.Api.Models;

public class AddonDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int Price { get; set; }
    public int SortOrder { get; set; }
}
