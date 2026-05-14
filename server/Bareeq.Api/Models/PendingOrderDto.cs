namespace Bareeq.Api.Models;

public class PendingOrderDto
{
    public Guid Id { get; set; }
    public string Source { get; set; } = string.Empty;
    public string? PaymentMethod { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public List<PendingOrderItemDto> Items { get; set; } = new();
}
