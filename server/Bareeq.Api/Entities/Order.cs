namespace Bareeq.Api.Entities;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public int Subtotal { get; set; }
    public int DeliveryFee { get; set; }
    public int Points { get; set; }
    public string Status { get; set; } = "Placed";
    public string Source { get; set; } = "Online";
    public string? BranchId { get; set; }
    public Branch? Branch { get; set; }
    public string DeliveryMethod { get; set; } = "Pickup";
    public string? DeliveryAddress { get; set; }
    public string? PaymentMethod { get; set; }
    public Guid? PaymentId { get; set; }
    public OrderPayment? Payment { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public List<OrderItem> Items { get; set; } = new();
}
