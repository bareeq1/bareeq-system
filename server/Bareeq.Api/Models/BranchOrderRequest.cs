namespace Bareeq.Api.Models;

public class BranchOrderRequest
{
    public List<OrderLineRequest> Items { get; set; } = new();
    public string PaymentMethod { get; set; } = "Cash";
    public string? Notes { get; set; }
}
