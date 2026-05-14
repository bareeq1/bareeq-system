using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class AdminOrderListTests : IClassFixture<TestWebFactory>
{
    private readonly TestWebFactory _factory;
    private readonly HttpClient _client;

    public AdminOrderListTests(TestWebFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task PlaceOrderAsync(string branchId = "helwan", string deliveryMethod = "Pickup")
    {
        var token = TestAuthHelper.GenerateToken(Guid.NewGuid());
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var resp = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId,
            deliveryMethod,
            deliveryAddress = deliveryMethod == "Delivery" ? "123 Test St" : null as string,
            items = new[] { new { itemId = "mac", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 } }
        });

        resp.EnsureSuccessStatusCode();
    }

    private async Task SeedOrderAsync(string branchId = "helwan", string status = "Placed")
    {
        var userId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            var order = new Order
            {
                UserId = userId,
                Status = status,
                Source = "Online",
                BranchId = branchId,
                DeliveryMethod = "Pickup",
                Subtotal = 100
            };
            db.Orders.Add(order);
            await db.SaveChangesAsync();
        });
    }

    private void AuthAsAdmin()
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            TestAuthHelper.GenerateToken(Guid.NewGuid(), "Admin"));
    }

    [Fact]
    public async Task GetAdminOrders_NonAdmin_Returns403()
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            TestAuthHelper.GenerateToken(Guid.NewGuid(), "Customer"));

        var response = await _client.GetAsync("/admin/orders");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetAdminOrders_Unauthenticated_Returns401()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.GetAsync("/admin/orders");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetAdminOrders_ReturnsOrders()
    {
        await SeedOrderAsync();
        AuthAsAdmin();

        var response = await _client.GetAsync("/admin/orders");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var orders = await response.Content.ReadFromJsonAsync<List<AdminOrderSummaryDto>>();
        Assert.NotNull(orders);
        Assert.NotEmpty(orders);
    }

    [Fact]
    public async Task GetAdminOrders_FiltersByBranch()
    {
        await PlaceOrderAsync("helwan");
        AuthAsAdmin();

        var response = await _client.GetAsync("/admin/orders?branch=helwan");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var orders = await response.Content.ReadFromJsonAsync<List<AdminOrderSummaryDto>>();
        Assert.NotNull(orders);
        Assert.All(orders, o => Assert.Equal("Helwan", o.BranchLabel));
    }

    [Fact]
    public async Task GetAdminOrders_FiltersByStatus()
    {
        await PlaceOrderAsync();
        AuthAsAdmin();

        var response = await _client.GetAsync("/admin/orders?status=Placed");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var orders = await response.Content.ReadFromJsonAsync<List<AdminOrderSummaryDto>>();
        Assert.NotNull(orders);
        Assert.All(orders, o => Assert.Equal("Placed", o.Status));
    }

    [Fact]
    public async Task GetAdminOrders_PageSizeRespected()
    {
        await PlaceOrderAsync();
        await PlaceOrderAsync();
        await PlaceOrderAsync();
        AuthAsAdmin();

        var response = await _client.GetAsync("/admin/orders?pageSize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var orders = await response.Content.ReadFromJsonAsync<List<AdminOrderSummaryDto>>();
        Assert.NotNull(orders);
        Assert.True(orders.Count <= 2);
    }
}
