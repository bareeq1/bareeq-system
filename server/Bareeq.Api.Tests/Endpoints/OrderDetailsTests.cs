using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class OrderDetailsTests : IClassFixture<TestWebFactory>
{
    private readonly TestWebFactory _factory;
    private readonly HttpClient _client;

    public OrderDetailsTests(TestWebFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task<Guid> PlaceOrderAsync(Guid userId)
    {
        var token = TestAuthHelper.GenerateToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "helwan",
            deliveryMethod = "Pickup",
            items = new[]
            {
                new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
            }
        });

        var result = await response.Content.ReadFromJsonAsync<CheckoutResponse>();
        return result!.OrderId;
    }

    [Fact]
    public async Task GetOrder_Unauthenticated_Returns401()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.GetAsync($"/orders/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetOrder_NotFound_Returns404()
    {
        var token = TestAuthHelper.GenerateToken(Guid.NewGuid());
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync($"/orders/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetOrder_OwnOrder_ReturnsOk()
    {
        var userId = Guid.NewGuid();
        var orderId = await PlaceOrderAsync(userId);

        var response = await _client.GetAsync($"/orders/{orderId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var order = await response.Content.ReadFromJsonAsync<OrderDto>();
        Assert.NotNull(order);
        Assert.Equal(orderId, order.Id);
        Assert.Equal("Placed", order.Status);
        Assert.Equal("helwan", order.BranchId);
        Assert.Equal("Pickup", order.DeliveryMethod);
        Assert.Single(order.Items);
    }

    [Fact]
    public async Task GetOrder_OtherUsersOrder_ReturnsForbid()
    {
        var ownerId = Guid.NewGuid();
        var orderId = await PlaceOrderAsync(ownerId);

        var otherToken = TestAuthHelper.GenerateToken(Guid.NewGuid());
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", otherToken);

        var response = await _client.GetAsync($"/orders/{orderId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetOrder_AdminCanViewAnyOrder()
    {
        var ownerId = Guid.NewGuid();
        var orderId = await PlaceOrderAsync(ownerId);

        var adminToken = TestAuthHelper.GenerateToken(Guid.NewGuid(), "Admin");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        var response = await _client.GetAsync($"/orders/{orderId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
