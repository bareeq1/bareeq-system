using Ardalis.ApiEndpoints;
using Bareeq.Api.Auth;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Bareeq.Api.Endpoints.Auth;

public class GoogleLogin : EndpointBaseAsync
    .WithRequest<AuthLoginRequest>
    .WithActionResult<AuthLoginResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly GoogleAuthService _googleAuthService;
    private readonly JwtTokenService _jwtTokenService;
    private readonly JwtOptions _jwtOptions;

    public GoogleLogin(AppDbContext dbContext, GoogleAuthService googleAuthService, JwtTokenService jwtTokenService, IOptions<JwtOptions> jwtOptions)
    {
        _dbContext = dbContext;
        _googleAuthService = googleAuthService;
        _jwtTokenService = jwtTokenService;
        _jwtOptions = jwtOptions.Value;
    }

    [HttpPost("auth/google")]
    [AllowAnonymous]
    public override async Task<ActionResult<AuthLoginResponse>> HandleAsync(AuthLoginRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
        {
            return BadRequest("OAuth code is required.");
        }

        var payload = await _googleAuthService.ValidateCodeAsync(request.Code, request.RedirectUri, cancellationToken);
        if (string.IsNullOrWhiteSpace(payload.Subject) || string.IsNullOrWhiteSpace(payload.Email))
        {
            return BadRequest("Google payload missing required fields.");
        }

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.GoogleSubject == payload.Subject || u.Email == payload.Email, cancellationToken);

        if (user is null)
        {
            user = new User
            {
                Email = payload.Email,
                FullName = payload.Name ?? payload.Email,
                AvatarUrl = payload.Picture,
                GoogleSubject = payload.Subject,
                Role = "User"
            };
            _dbContext.Users.Add(user);
        }
        else
        {
            user.Email = payload.Email;
            user.FullName = payload.Name ?? user.FullName;
            user.AvatarUrl = payload.Picture ?? user.AvatarUrl;
            user.GoogleSubject = payload.Subject;
            user.UpdatedAt = DateTimeOffset.UtcNow;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        var token = _jwtTokenService.CreateToken(user);

        var response = new AuthLoginResponse
        {
            AccessToken = token,
            ExpiresInMinutes = _jwtOptions.TokenMinutes,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                Role = user.Role
            }
        };

        return Ok(response);
    }
}
