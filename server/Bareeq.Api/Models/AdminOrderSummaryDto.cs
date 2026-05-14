namespace Bareeq.Api.Models;

public class AdminOrderSummaryDto
{
    public Guid OrderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string BranchLabel { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? PaymentStatus { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public int Total { get; set; }
}
