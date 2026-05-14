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
        if (string.IsNullOrWhiteSpace(normalizedRole) || (normalizedRole != "User" && normalizedRole != "Admin" && normalizedRole != "BranchStaff"))
        {
            return BadRequest("Role must be User, Admin, or BranchStaff.");
        }

        if (normalizedRole == "BranchStaff" && string.IsNullOrWhiteSpace(request.BranchId))
            return BadRequest("BranchId is required when assigning BranchStaff role.");

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        if (normalizedRole == "BranchStaff")
        {
            var branch = await _dbContext.Branches.FindAsync([request.BranchId], cancellationToken);
            if (branch is null)
                return BadRequest("Invalid branch.");
            user.BranchId = branch.Id;
        }
        else
        {
            user.BranchId = null;
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
