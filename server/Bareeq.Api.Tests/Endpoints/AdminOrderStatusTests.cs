using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class AdminOrderStatusTests : IClassFixture<TestWebFactory>
{
    private readonly TestWebFactory _factory;
    private readonly HttpClient _client;

    public AdminOrderStatusTests(TestWebFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task<Guid> PlaceOrderForUserAsync()
    {
        var userId = Guid.NewGuid();

        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User { Id = userId, Email = $"{userId}@test.com", FullName = "Test", GoogleSubject = userId.ToString(), Role = "Customer" });
            await db.SaveChangesAsync();
        });

        var token = TestAuthHelper.GenerateToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "helwan",
            deliveryMethod = "Pickup",
            items = new[] { new { itemId = "tur", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 } }
        });

        var result = await response.Content.ReadFromJsonAsync<CheckoutResponse>();
        return result!.OrderId;
    }

    private void AuthAsAdmin()
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            TestAuthHelper.GenerateToken(Guid.NewGuid(), "Admin"));
    }

    [Fact]
    public async Task UpdateStatus_NonAdmin_Returns403()
    {
        var orderId = await PlaceOrderForUserAsync();

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            TestAuthHelper.GenerateToken(Guid.NewGuid(), "Customer"));

        var response = await _client.PutAsJsonAsync($"/orders/{orderId}/status", new { status = "Confirmed" });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task UpdateStatus_NotFound_Returns404()
    {
        AuthAsAdmin();

        var response = await _client.PutAsJsonAsync($"/orders/{Guid.NewGuid()}/status", new { status = "Confirmed" });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateStatus_InvalidStatus_Returns400()
    {
        var orderId = await PlaceOrderForUserAsync();
        AuthAsAdmin();

        var response = await _client.PutAsJsonAsync($"/orders/{orderId}/status", new { status = "Vaporized" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateStatus_Ready_UpdatesOrderStatus()
    {
        var orderId = await PlaceOrderForUserAsync();
        AuthAsAdmin();

        var response = await _client.PutAsJsonAsync($"/orders/{orderId}/status", new { status = "Ready" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<OrderStatusUpdateResponse>();
        Assert.Equal("Ready", result!.NewStatus);
    }

    [Fact]
    public async Task UpdateStatus_Completed_UpdatesOrderStatus()
    {
        var orderId = await PlaceOrderForUserAsync();
        AuthAsAdmin();

        var response = await _client.PutAsJsonAsync($"/orders/{orderId}/status", new { status = "Completed" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<OrderStatusUpdateResponse>();
        Assert.Equal("Completed", result!.NewStatus);
    }
}
