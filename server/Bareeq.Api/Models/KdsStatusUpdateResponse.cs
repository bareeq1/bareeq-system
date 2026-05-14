namespace Bareeq.Api.Models;

public class KdsStatusUpdateResponse
{
    public Guid OrderId { get; set; }
    public Guid ItemId { get; set; }
    public string KdsStatus { get; set; } = string.Empty;
    public string OrderStatus { get; set; } = string.Empty;
}
