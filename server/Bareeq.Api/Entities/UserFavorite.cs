namespace Bareeq.Api.Entities;

public class UserFavorite
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string ItemId { get; set; } = string.Empty;
    public Item? Item { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
