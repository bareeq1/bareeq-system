using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class BranchOrderTests : IClassFixture<TestWebFactory>
{
    private readonly TestWebFactory _factory;
    private readonly HttpClient _client;

    public BranchOrderTests(TestWebFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private static object ValidCashRequest() => new
    {
        paymentMethod = "Cash",
        items = new[]
        {
            new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
        }
    };

    private async Task<Guid> SeedStaffUserAsync(string? branchId = "helwan")
    {
        var userId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User
            {
                Id = userId,
                Email = $"{userId}@staff.com",
                FullName = "Test Staff",
                GoogleSubject = userId.ToString(),
                Role = "BranchStaff",
                BranchId = branchId
            });
            await db.SaveChangesAsync();
        });
        return userId;
    }

    private void AuthAs(Guid userId, string role = "BranchStaff")
    {
        var token = TestAuthHelper.GenerateToken(userId, role);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    [Fact]
    public async Task BranchOrder_Unauthenticated_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/orders/branch", ValidCashRequest());

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task BranchOrder_CustomerRole_Returns403()
    {
        AuthAs(Guid.NewGuid(), "Customer");

        var response = await _client.PostAsJsonAsync("/orders/branch", ValidCashRequest());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task BranchOrder_StaffWithoutBranchAssigned_Returns400()
    {
        var userId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User
            {
                Id = userId,
                Email = $"{userId}@staff.com",
                FullName = "Test Staff NoBranch",
                GoogleSubject = userId.ToString(),
                Role = "BranchStaff",
                BranchId = null
            });
            await db.SaveChangesAsync();
        });
        AuthAs(userId, "BranchStaff");

        var response = await _client.PostAsJsonAsync("/orders/branch", ValidCashRequest());

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task BranchOrder_ValidCash_ReturnsConfirmedOrder()
    {
        var userId = await SeedStaffUserAsync("helwan");
        AuthAs(userId, "BranchStaff");

        var response = await _client.PostAsJsonAsync("/orders/branch", ValidCashRequest());

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<CheckoutResponse>();
        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.OrderId);
        Assert.Equal("Confirmed", result.Status);
        Assert.Equal("helwan", result.BranchId);
        Assert.Equal("Pickup", result.DeliveryMethod);
        Assert.Equal(0, result.DeliveryFee);
    }

    [Fact]
    public async Task BranchOrder_ValidCard_ReturnsConfirmedOrder()
    {
        var userId = await SeedStaffUserAsync("hadayek-helwan");
        AuthAs(userId, "BranchStaff");

        var response = await _client.PostAsJsonAsync("/orders/branch", new
        {
            paymentMethod = "Card",
            items = new[]
            {
                new { itemId = "esp", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 2 }
            }
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<CheckoutResponse>();
        Assert.NotNull(result);
        Assert.Equal("Confirmed", result.Status);
        Assert.Equal("hadayek-helwan", result.BranchId);
    }

    [Fact]
    public async Task BranchOrder_EmptyItems_Returns400()
    {
        var userId = await SeedStaffUserAsync();
        AuthAs(userId, "BranchStaff");

        var response = await _client.PostAsJsonAsync("/orders/branch", new
        {
            paymentMethod = "Cash",
            items = Array.Empty<object>()
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task BranchOrder_InvalidItem_Returns400()
    {
        var userId = await SeedStaffUserAsync();
        AuthAs(userId, "BranchStaff");

        var response = await _client.PostAsJsonAsync("/orders/branch", new
        {
            paymentMethod = "Cash",
            items = new[]
            {
                new { itemId = "nonexistent-item", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
            }
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task BranchOrder_InvalidPaymentMethod_Returns400()
    {
        var userId = await SeedStaffUserAsync();
        AuthAs(userId, "BranchStaff");

        var response = await _client.PostAsJsonAsync("/orders/branch", new
        {
            paymentMethod = "Bitcoin",
            items = new[]
            {
                new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
            }
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
