namespace Bareeq.Api.Models;

public class CheckoutResponse
{
    public Guid OrderId { get; set; }
    public int Subtotal { get; set; }
    public int DeliveryFee { get; set; }
    public int Total { get; set; }
    public string BranchId { get; set; } = string.Empty;
    public string BranchLabel { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
