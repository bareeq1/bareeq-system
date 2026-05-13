namespace Bareeq.Api.Models;

public class OrderDto
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public int Subtotal { get; set; }
    public int Points { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}
