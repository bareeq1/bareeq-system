namespace Bareeq.Api.Entities;

public class OrderItemAddon
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderItemId { get; set; }
    public OrderItem? OrderItem { get; set; }

    public string AddonId { get; set; } = string.Empty;
    public string AddonLabel { get; set; } = string.Empty;
    public int AddonPrice { get; set; }
}
