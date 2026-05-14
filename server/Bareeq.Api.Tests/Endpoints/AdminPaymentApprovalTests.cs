using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace Bareeq.Api.Tests.Endpoints;

public class AdminPaymentApprovalTests : IClassFixture<TestWebFactory>
{
    private readonly TestWebFactory _factory;
    private readonly HttpClient _client;

    private static readonly byte[] FakeJpeg = [0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10];

    public AdminPaymentApprovalTests(TestWebFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task<(Guid orderId, Guid paymentId)> PlaceOrderAndUploadPaymentAsync()
    {
        var userId = Guid.NewGuid();

        // Seed user so Include(o.User) doesn't return null
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User { Id = userId, Email = $"{userId}@test.com", FullName = "Test Customer", GoogleSubject = userId.ToString(), Role = "Customer" });
            await db.SaveChangesAsync();
        });

        var token = TestAuthHelper.GenerateToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var checkoutResp = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "helwan",
            deliveryMethod = "Pickup",
            items = new[] { new { itemId = "am", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 } }
        });
        var order = await checkoutResp.Content.ReadFromJsonAsync<CheckoutResponse>();

        var form = new MultipartFormDataContent();
        var content = new ByteArrayContent(FakeJpeg);
        content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpeg");
        form.Add(content, "file", "receipt.jpg");

        var paymentResp = await _client.PostAsync($"/orders/{order!.OrderId}/payment", form);
        var payment = await paymentResp.Content.ReadFromJsonAsync<PaymentSubmissionResponse>();

        return (order.OrderId, payment!.PaymentId);
    }

    private void AuthAsAdmin()
    {
        var adminToken = TestAuthHelper.GenerateToken(Guid.NewGuid(), "Admin");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);
    }

    [Fact]
    public async Task ApprovePayment_NonAdmin_Returns403()
    {
        var (orderId, paymentId) = await PlaceOrderAndUploadPaymentAsync();

        var customerToken = TestAuthHelper.GenerateToken(Guid.NewGuid(), "Customer");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", customerToken);

        var response = await _client.PutAsJsonAsync(
            $"/orders/{orderId}/payment/{paymentId}/approve",
            new { approved = true });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ApprovePayment_NotFound_Returns404()
    {
        AuthAsAdmin();

        var response = await _client.PutAsJsonAsync(
            $"/orders/{Guid.NewGuid()}/payment/{Guid.NewGuid()}/approve",
            new { approved = true });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ApprovePayment_Approve_SetsOrderToConfirmed()
    {
        var (orderId, paymentId) = await PlaceOrderAndUploadPaymentAsync();
        AuthAsAdmin();

        var response = await _client.PutAsJsonAsync(
            $"/orders/{orderId}/payment/{paymentId}/approve",
            new { approved = true });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<PaymentApprovalResponse>();
        Assert.Equal("Confirmed", result!.Status);
    }

    [Fact]
    public async Task ApprovePayment_Reject_RequiresReason()
    {
        var (orderId, paymentId) = await PlaceOrderAndUploadPaymentAsync();
        AuthAsAdmin();

        var response = await _client.PutAsJsonAsync(
            $"/orders/{orderId}/payment/{paymentId}/approve",
            new { approved = false, rejectionReason = (string?)null });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ApprovePayment_Reject_WithReason_SetsOrderBackToPlaced()
    {
        var (orderId, paymentId) = await PlaceOrderAndUploadPaymentAsync();
        AuthAsAdmin();

        var response = await _client.PutAsJsonAsync(
            $"/orders/{orderId}/payment/{paymentId}/approve",
            new { approved = false, rejectionReason = "Image unreadable" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<PaymentApprovalResponse>();
        Assert.Equal("Placed", result!.Status);
    }

    [Fact]
    public async Task ApprovePayment_AlreadyReviewed_Returns400()
    {
        var (orderId, paymentId) = await PlaceOrderAndUploadPaymentAsync();
        AuthAsAdmin();

        await _client.PutAsJsonAsync(
            $"/orders/{orderId}/payment/{paymentId}/approve",
            new { approved = true });

        var secondResponse = await _client.PutAsJsonAsync(
            $"/orders/{orderId}/payment/{paymentId}/approve",
            new { approved = true });

        Assert.Equal(HttpStatusCode.BadRequest, secondResponse.StatusCode);
    }
}
