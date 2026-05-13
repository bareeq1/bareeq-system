namespace Bareeq.Api.Models;

public class CatalogResponse
{
    public List<CategoryDto> Categories { get; set; } = new();
    public List<ItemDto> Items { get; set; } = new();
    public List<AddonDto> Addons { get; set; } = new();
    public List<OptionDto> Milks { get; set; } = new();
    public List<OptionDto> Sizes { get; set; } = new();
}
