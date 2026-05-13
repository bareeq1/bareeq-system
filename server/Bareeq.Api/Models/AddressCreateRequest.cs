namespace Bareeq.Api.Models;

public class AddressCreateRequest
{
    public string Label { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}
