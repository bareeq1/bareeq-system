namespace Bareeq.Api.Entities;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public int Subtotal { get; set; }
    public int Points { get; set; }
    public string Status { get; set; } = "Placed";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public List<OrderItem> Items { get; set; } = new();
}
