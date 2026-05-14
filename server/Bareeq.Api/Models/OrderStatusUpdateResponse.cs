namespace Bareeq.Api.Models;

public class OrderStatusUpdateResponse
{
    public Guid OrderId { get; set; }
    public string NewStatus { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
