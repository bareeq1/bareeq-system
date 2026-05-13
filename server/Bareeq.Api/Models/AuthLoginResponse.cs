namespace Bareeq.Api.Models;

public class AuthLoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public int ExpiresInMinutes { get; set; }
    public UserDto User { get; set; } = new();
}
