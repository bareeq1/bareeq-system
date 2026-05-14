using Bareeq.Api.Configuration;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Bareeq.Api.Services;

public class BrevoEmailService : IEmailService
{
    private readonly HttpClient _http;
    private readonly BrevoOptions _options;
    private const string ApiUrl = "https://api.brevo.com/v3/smtp/email";

    public BrevoEmailService(HttpClient http, IOptions<BrevoOptions> options)
    {
        _http = http;
        _options = options.Value;
    }

    public Task SendPaymentSubmittedToAdminAsync(string adminEmail, string adminName, Guid orderId, string customerName, int total, string branchLabel, string imageUrl, CancellationToken cancellationToken = default)
    {
        var subject = $"[Bareeq] New Payment Receipt — Order #{orderId.ToString()[..8]}";
        var html = $"""
            <h2>New Payment Receipt Submitted</h2>
            <p><strong>Customer:</strong> {customerName}</p>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Branch:</strong> {branchLabel}</p>
            <p><strong>Total:</strong> {total / 100m:F2} EGP</p>
            <p><strong>Receipt Image:</strong> <a href="{imageUrl}">View Image</a></p>
            <p>Please log into the admin dashboard to approve or reject this payment.</p>
            """;

        return SendAsync(adminEmail, adminName, subject, html, cancellationToken);
    }

    public Task SendOrderConfirmedAsync(string customerEmail, string customerName, Guid orderId, int total, string branchLabel, string deliveryMethod, CancellationToken cancellationToken = default)
    {
        var subject = $"Your Bareeq order is confirmed! 🎉";
        var html = $"""
            <h2>Order Confirmed</h2>
            <p>Hi {customerName}, your payment has been approved and your order is confirmed.</p>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Branch:</strong> {branchLabel}</p>
            <p><strong>Delivery Method:</strong> {deliveryMethod}</p>
            <p><strong>Total:</strong> {total / 100m:F2} EGP</p>
            <p>We'll notify you when your order is ready!</p>
            """;

        return SendAsync(customerEmail, customerName, subject, html, cancellationToken);
    }

    public Task SendPaymentRejectedAsync(string customerEmail, string customerName, Guid orderId, string rejectionReason, CancellationToken cancellationToken = default)
    {
        var subject = "Action required: Payment receipt rejected";
        var html = $"""
            <h2>Payment Receipt Rejected</h2>
            <p>Hi {customerName}, unfortunately your payment receipt for order <strong>{orderId}</strong> was rejected.</p>
            <p><strong>Reason:</strong> {rejectionReason}</p>
            <p>Please resubmit a clear photo of your Instapay payment receipt through the app.</p>
            """;

        return SendAsync(customerEmail, customerName, subject, html, cancellationToken);
    }

    public Task SendOrderReadyAsync(string customerEmail, string customerName, Guid orderId, string branchLabel, string deliveryMethod, CancellationToken cancellationToken = default)
    {
        var action = deliveryMethod == "Pickup" ? $"ready for pickup at {branchLabel}" : "out for delivery";
        var subject = "Your Bareeq order is ready!";
        var html = $"""
            <h2>Your Order is Ready</h2>
            <p>Hi {customerName}, your order <strong>{orderId}</strong> is {action}.</p>
            <p><strong>Branch:</strong> {branchLabel}</p>
            """;

        return SendAsync(customerEmail, customerName, subject, html, cancellationToken);
    }

    public Task SendOrderCompletedAsync(string customerEmail, string customerName, Guid orderId, CancellationToken cancellationToken = default)
    {
        var subject = "Thanks for your Bareeq order!";
        var html = $"""
            <h2>Order Completed</h2>
            <p>Hi {customerName}, your order <strong>{orderId}</strong> has been completed. Thank you for choosing Bareeq!</p>
            <p>We hope to see you again soon. ☕</p>
            """;

        return SendAsync(customerEmail, customerName, subject, html, cancellationToken);
    }

    private async Task SendAsync(string toEmail, string toName, string subject, string htmlContent, CancellationToken cancellationToken)
    {
        var payload = new
        {
            sender = new { email = _options.FromEmail, name = _options.FromName },
            to = new[] { new { email = toEmail, name = toName } },
            subject,
            htmlContent
        };

        var request = new HttpRequestMessage(HttpMethod.Post, ApiUrl);
        request.Headers.Add("api-key", _options.ApiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await _http.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }
}
