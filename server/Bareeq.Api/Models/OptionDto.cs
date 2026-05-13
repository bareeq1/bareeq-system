namespace Bareeq.Api.Models;

public class OptionDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int Delta { get; set; }
    public int SortOrder { get; set; }
}
