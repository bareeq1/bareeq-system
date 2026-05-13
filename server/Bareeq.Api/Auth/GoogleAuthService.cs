using System.Net.Http.Json;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace Bareeq.Api.Auth;

public class GoogleAuthService
{
    private readonly HttpClient _httpClient;
    private readonly GoogleAuthOptions _options;

    public GoogleAuthService(HttpClient httpClient, IOptions<GoogleAuthOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<GoogleJsonWebSignature.Payload> ValidateCodeAsync(string code, string redirectUri, CancellationToken cancellationToken)
    {
        var response = await ExchangeCodeAsync(code, redirectUri, cancellationToken);
        if (string.IsNullOrWhiteSpace(response.IdToken))
        {
            throw new InvalidOperationException("Google token response missing id_token.");
        }

        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { _options.ClientId }
        };

        return await GoogleJsonWebSignature.ValidateAsync(response.IdToken, settings);
    }

    private async Task<GoogleTokenResponse> ExchangeCodeAsync(string code, string redirectUri, CancellationToken cancellationToken)
    {
        var request = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["code"] = code,
            ["client_id"] = _options.ClientId,
            ["client_secret"] = _options.ClientSecret,
            ["redirect_uri"] = string.IsNullOrWhiteSpace(redirectUri) ? _options.RedirectUri : redirectUri,
            ["grant_type"] = "authorization_code"
        });

        using var response = await _httpClient.PostAsync("https://oauth2.googleapis.com/token", request, cancellationToken);
        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<GoogleTokenResponse>(cancellationToken: cancellationToken);
        return payload ?? new GoogleTokenResponse();
    }
}
