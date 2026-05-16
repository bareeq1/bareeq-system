namespace Bareeq.Api.Models;

public class AdminDashboardDto
{
    public int TotalOrders { get; set; }
    public int TotalRevenue { get; set; }
    public List<TopBeverageDto> TopBeverages { get; set; } = new();
}

public class TopBeverageDto
{
    public string ItemId { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public int TotalQuantity { get; set; }
}
