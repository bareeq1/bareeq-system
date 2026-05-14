using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class CheckoutTests : IClassFixture<TestWebFactory>
{
    private readonly HttpClient _client;

    public CheckoutTests(TestWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    private void Authenticate(string role = "Customer")
    {
        var token = TestAuthHelper.GenerateToken(Guid.NewGuid(), role);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    private static object ValidPickupRequest() => new
    {
        branchId = "helwan",
        deliveryMethod = "Pickup",
        items = new[]
        {
            new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
        }
    };

    [Fact]
    public async Task Checkout_Unauthenticated_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/orders/checkout", ValidPickupRequest());

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Checkout_EmptyItems_Returns400()
    {
        Authenticate();

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "helwan",
            deliveryMethod = "Pickup",
            items = Array.Empty<object>()
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Checkout_InvalidBranch_Returns400()
    {
        Authenticate();

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "nonexistent-branch",
            deliveryMethod = "Pickup",
            items = new[]
            {
                new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
            }
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Checkout_InvalidDeliveryMethod_Returns400()
    {
        Authenticate();

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "helwan",
            deliveryMethod = "Teleport",
            items = new[]
            {
                new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
            }
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Checkout_DeliveryWithoutAddress_Returns400()
    {
        Authenticate();

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "helwan",
            deliveryMethod = "Delivery",
            deliveryAddress = (string?)null,
            items = new[]
            {
                new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
            }
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Checkout_ValidPickup_ReturnsOrderIdAndZeroDeliveryFee()
    {
        Authenticate();

        var response = await _client.PostAsJsonAsync("/orders/checkout", ValidPickupRequest());

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<CheckoutResponse>();
        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.OrderId);
        Assert.Equal(0, result.DeliveryFee);
        Assert.Equal("helwan", result.BranchId);
        Assert.Equal("Pickup", result.DeliveryMethod);
        Assert.Equal("Placed", result.Status);
        Assert.Equal(result.Subtotal, result.Total);
    }

    [Fact]
    public async Task Checkout_ValidDelivery_ReturnsNonZeroDeliveryFee()
    {
        Authenticate();

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "hadayek-helwan",
            deliveryMethod = "Delivery",
            deliveryAddress = "123 Test Street",
            items = new[]
            {
                new { itemId = "esp", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 2 }
            }
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<CheckoutResponse>();
        Assert.NotNull(result);
        Assert.True(result.DeliveryFee > 0);
        Assert.Equal(result.Subtotal + result.DeliveryFee, result.Total);
    }

    [Fact]
    public async Task Checkout_InvalidItem_Returns400()
    {
        Authenticate();

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "helwan",
            deliveryMethod = "Pickup",
            items = new[]
            {
                new { itemId = "nonexistent-item", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
            }
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
