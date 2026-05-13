namespace Bareeq.Api.Auth;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "bareeq-api";
    public string Audience { get; set; } = "bareeq-spa";
    public string SigningKey { get; set; } = "CHANGE_ME_DEV_ONLY";
    public int TokenMinutes { get; set; } = 120;
}
