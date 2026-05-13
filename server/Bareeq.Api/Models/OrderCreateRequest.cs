namespace Bareeq.Api.Models;

public class OrderCreateRequest
{
    public List<OrderLineRequest> Items { get; set; } = new();
}
