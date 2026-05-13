using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Endpoints.Admin;

public class SetUserRole : EndpointBaseAsync
    .WithRequest<UpdateUserRoleRequest>
    .WithActionResult<UserDto>
{
    private readonly AppDbContext _dbContext;

    public SetUserRole(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPut("admin/users/role")]
    [Authorize(Roles = "Admin")]
    public override async Task<ActionResult<UserDto>> HandleAsync(UpdateUserRoleRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedRole = request.Role?.Trim();
        if (string.IsNullOrWhiteSpace(normalizedRole) || (normalizedRole != "User" && normalizedRole != "Admin"))
        {
            return BadRequest("Role must be either User or Admin.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        user.Role = normalizedRole;
        user.UpdatedAt = DateTimeOffset.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role
        });
    }
}
