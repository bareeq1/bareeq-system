namespace Bareeq.Api.Models;

public class UpdateUserRoleRequest
{
    public Guid UserId { get; set; }
    public string Role { get; set; } = "User";
    public string? BranchId { get; set; }
}
