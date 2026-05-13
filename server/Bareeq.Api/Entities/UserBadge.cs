namespace Bareeq.Api.Entities;

public class UserBadge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string BadgeId { get; set; } = string.Empty;
    public Badge? Badge { get; set; }

    public bool Earned { get; set; }
    public DateTimeOffset? EarnedAt { get; set; }
}
