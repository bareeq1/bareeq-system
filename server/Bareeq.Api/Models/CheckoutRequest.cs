namespace Bareeq.Api.Models;

public class CheckoutRequest
{
    public List<OrderLineRequest> Items { get; set; } = new();
    public string BranchId { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = "Pickup";
    public string? DeliveryAddress { get; set; }
}
