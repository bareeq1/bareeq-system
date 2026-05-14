namespace Bareeq.Api.Entities;

public class Branch
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Hours { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
