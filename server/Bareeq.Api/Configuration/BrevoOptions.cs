namespace Bareeq.Api.Configuration;

public class BrevoOptions
{
    public const string SectionName = "Brevo";
    public string ApiKey { get; set; } = string.Empty;
    public string FromEmail { get; set; } = "noreply@bareeq.coffee";
    public string FromName { get; set; } = "Bareeq Coffee";
}
