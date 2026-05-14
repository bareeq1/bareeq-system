using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class ConfirmPaymentTests : IClassFixture<TestWebFactory>
{
    private readonly TestWebFactory _factory;
    private readonly HttpClient _client;

    public ConfirmPaymentTests(TestWebFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task<(Guid staffId, Guid orderId)> SetupOnlineOrderAsync(string branchId = "helwan")
    {
        var customerId = Guid.NewGuid();
        var staffId = Guid.NewGuid();

        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User
            {
                Id = customerId,
                Email = $"{customerId}@customer.com",
                FullName = "Customer",
                GoogleSubject = customerId.ToString(),
                Role = "Customer"
            });
            db.Users.Add(new User
            {
                Id = staffId,
                Email = $"{staffId}@staff.com",
                FullName = "Staff",
                GoogleSubject = staffId.ToString(),
                Role = "BranchStaff",
                BranchId = branchId
            });
            await db.SaveChangesAsync();
        });

        // Place an online order as customer
        var customerToken = TestAuthHelper.GenerateToken(customerId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", customerToken);

        var checkoutResp = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId,
            deliveryMethod = "Pickup",
            items = new[] { new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 } }
        });
        var order = await checkoutResp.Content.ReadFromJsonAsync<CheckoutResponse>();

        return (staffId, order!.OrderId);
    }

    private void AuthAsStaff(Guid staffId)
    {
        var token = TestAuthHelper.GenerateToken(staffId, "BranchStaff");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    [Fact]
    public async Task ConfirmPayment_Unauthenticated_Returns401()
    {
        var (_, orderId) = await SetupOnlineOrderAsync();
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.PostAsJsonAsync($"/orders/{orderId}/confirm-payment", new { paymentMethod = "Cash" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ConfirmPayment_CustomerRole_Returns403()
    {
        var (_, orderId) = await SetupOnlineOrderAsync();
        var token = TestAuthHelper.GenerateToken(Guid.NewGuid(), "Customer");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.PostAsJsonAsync($"/orders/{orderId}/confirm-payment", new { paymentMethod = "Cash" });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ConfirmPayment_OrderNotFound_Returns404()
    {
        var staffId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User { Id = staffId, Email = $"{staffId}@s.com", FullName = "S", GoogleSubject = staffId.ToString(), Role = "BranchStaff", BranchId = "helwan" });
            await db.SaveChangesAsync();
        });
        AuthAsStaff(staffId);

        var response = await _client.PostAsJsonAsync($"/orders/{Guid.NewGuid()}/confirm-payment", new { paymentMethod = "Cash" });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ConfirmPayment_WrongBranchStaff_Returns403()
    {
        var (_, orderId) = await SetupOnlineOrderAsync("helwan");

        // Staff assigned to a different branch
        var wrongStaffId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User { Id = wrongStaffId, Email = $"{wrongStaffId}@s.com", FullName = "Wrong", GoogleSubject = wrongStaffId.ToString(), Role = "BranchStaff", BranchId = "hadayek-helwan" });
            await db.SaveChangesAsync();
        });
        AuthAsStaff(wrongStaffId);

        var response = await _client.PostAsJsonAsync($"/orders/{orderId}/confirm-payment", new { paymentMethod = "Cash" });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ConfirmPayment_ValidCash_SetsOrderConfirmed()
    {
        var (staffId, orderId) = await SetupOnlineOrderAsync();
        AuthAsStaff(staffId);

        var response = await _client.PostAsJsonAsync($"/orders/{orderId}/confirm-payment", new { paymentMethod = "Cash" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ConfirmPaymentResponse>();
        Assert.NotNull(result);
        Assert.Equal("Confirmed", result.Status);
        Assert.Equal("Cash", result.PaymentMethod);
        Assert.Equal(orderId, result.OrderId);
    }

    [Fact]
    public async Task ConfirmPayment_ValidCard_SetsOrderConfirmed()
    {
        var (staffId, orderId) = await SetupOnlineOrderAsync();
        AuthAsStaff(staffId);

        var response = await _client.PostAsJsonAsync($"/orders/{orderId}/confirm-payment", new { paymentMethod = "Card" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ConfirmPaymentResponse>();
        Assert.Equal("Confirmed", result!.Status);
        Assert.Equal("Card", result.PaymentMethod);
    }

    [Fact]
    public async Task ConfirmPayment_AlreadyConfirmed_Returns400()
    {
        var (staffId, orderId) = await SetupOnlineOrderAsync();
        AuthAsStaff(staffId);

        // First confirm
        await _client.PostAsJsonAsync($"/orders/{orderId}/confirm-payment", new { paymentMethod = "Cash" });

        // Second confirm attempt
        var response = await _client.PostAsJsonAsync($"/orders/{orderId}/confirm-payment", new { paymentMethod = "Cash" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ConfirmPayment_InvalidPaymentMethod_Returns400()
    {
        var (staffId, orderId) = await SetupOnlineOrderAsync();
        AuthAsStaff(staffId);

        var response = await _client.PostAsJsonAsync($"/orders/{orderId}/confirm-payment", new { paymentMethod = "Crypto" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
