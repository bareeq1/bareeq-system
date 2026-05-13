namespace Bareeq.Api.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string GoogleSubject { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public int Sparkles { get; set; }
    public int StreakCount { get; set; }
    public DateTimeOffset? LastStreakAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
