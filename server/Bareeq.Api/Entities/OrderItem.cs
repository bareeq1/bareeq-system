namespace Bareeq.Api.Entities;

public class OrderItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }

    public string ItemId { get; set; } = string.Empty;
    public Item? Item { get; set; }
    public string SizeId { get; set; } = string.Empty;
    public string MilkId { get; set; } = string.Empty;
    public string? Notes { get; set; }

    public int Quantity { get; set; }
    public int UnitPrice { get; set; }
    public int LineTotal { get; set; }

    public string KdsStatus { get; set; } = "Pending";

    public List<OrderItemAddon> Addons { get; set; } = new();
}
