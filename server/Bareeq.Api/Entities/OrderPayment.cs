namespace Bareeq.Api.Entities;

public class OrderPayment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTimeOffset SubmittedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ReviewedAt { get; set; }
    public Guid? ReviewedBy { get; set; }
    public User? Reviewer { get; set; }
    public string? RejectionReason { get; set; }
}
