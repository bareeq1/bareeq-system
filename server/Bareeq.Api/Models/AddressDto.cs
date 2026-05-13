namespace Bareeq.Api.Models;

public class AddressDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}
