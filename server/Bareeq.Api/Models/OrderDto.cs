namespace Bareeq.Api.Models;

public class OrderDto
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public int Subtotal { get; set; }
    public int DeliveryFee { get; set; }
    public int Total { get; set; }
    public int Points { get; set; }
    public string? BranchId { get; set; }
    public string? BranchLabel { get; set; }
    public string DeliveryMethod { get; set; } = string.Empty;
    public string? DeliveryAddress { get; set; }
    public OrderPaymentDto? Payment { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}
