namespace Bareeq.Api.Models;

public class AdminPaymentDetailsDto
{
    public Guid PaymentId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset SubmittedAt { get; set; }
    public AdminOrderSummaryDto Order { get; set; } = new();
}
