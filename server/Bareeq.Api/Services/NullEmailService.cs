namespace Bareeq.Api.Services;

public class NullEmailService : IEmailService
{
    public Task SendPaymentSubmittedToAdminAsync(string adminEmail, string adminName, Guid orderId, string customerName, int total, string branchLabel, string imageUrl, CancellationToken cancellationToken = default)
        => Task.CompletedTask;

    public Task SendOrderConfirmedAsync(string customerEmail, string customerName, Guid orderId, int total, string branchLabel, string deliveryMethod, CancellationToken cancellationToken = default)
        => Task.CompletedTask;

    public Task SendPaymentRejectedAsync(string customerEmail, string customerName, Guid orderId, string rejectionReason, CancellationToken cancellationToken = default)
        => Task.CompletedTask;

    public Task SendOrderReadyAsync(string customerEmail, string customerName, Guid orderId, string branchLabel, string deliveryMethod, CancellationToken cancellationToken = default)
        => Task.CompletedTask;

    public Task SendOrderCompletedAsync(string customerEmail, string customerName, Guid orderId, CancellationToken cancellationToken = default)
        => Task.CompletedTask;
}
