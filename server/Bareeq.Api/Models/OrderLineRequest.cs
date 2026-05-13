namespace Bareeq.Api.Models;

public class OrderLineRequest
{
    public string ItemId { get; set; } = string.Empty;
    public string SizeId { get; set; } = "single";
    public string MilkId { get; set; } = "fresh";
    public List<string> AddonIds { get; set; } = new();
    public int Quantity { get; set; } = 1;
    public string? Notes { get; set; }
}
