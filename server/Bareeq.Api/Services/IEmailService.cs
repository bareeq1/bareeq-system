namespace Bareeq.Api.Services;

public interface IEmailService
{
    Task SendPaymentSubmittedToAdminAsync(string adminEmail, string adminName, Guid orderId, string customerName, int total, string branchLabel, string imageUrl, CancellationToken cancellationToken = default);
    Task SendOrderConfirmedAsync(string customerEmail, string customerName, Guid orderId, int total, string branchLabel, string deliveryMethod, CancellationToken cancellationToken = default);
    Task SendPaymentRejectedAsync(string customerEmail, string customerName, Guid orderId, string rejectionReason, CancellationToken cancellationToken = default);
    Task SendOrderReadyAsync(string customerEmail, string customerName, Guid orderId, string branchLabel, string deliveryMethod, CancellationToken cancellationToken = default);
    Task SendOrderCompletedAsync(string customerEmail, string customerName, Guid orderId, CancellationToken cancellationToken = default);
}
