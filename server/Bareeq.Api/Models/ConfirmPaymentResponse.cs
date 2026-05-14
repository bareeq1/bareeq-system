namespace Bareeq.Api.Models;

public class ConfirmPaymentResponse
{
    public Guid OrderId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
}
