namespace Bareeq.Api.Models;

public class OrderItemDto
{
    public string ItemId { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string SizeId { get; set; } = string.Empty;
    public string MilkId { get; set; } = string.Empty;
    public List<string> AddonIds { get; set; } = new();
    public string? Notes { get; set; }
    public int Quantity { get; set; }
    public int UnitPrice { get; set; }
    public int LineTotal { get; set; }
}
