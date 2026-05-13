namespace Bareeq.Api.Models;

public class AuthLoginRequest
{
    public string Code { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = string.Empty;
}
