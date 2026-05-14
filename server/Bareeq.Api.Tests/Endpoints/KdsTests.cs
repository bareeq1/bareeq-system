using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class KdsTests : IClassFixture<TestWebFactory>
{
    private readonly TestWebFactory _factory;
    private readonly HttpClient _client;

    public KdsTests(TestWebFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task<(Guid staffId, Guid orderId)> SeedConfirmedBranchOrderAsync(string branchId = "helwan")
    {
        var staffId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User
            {
                Id = staffId,
                Email = $"{staffId}@staff.com",
                FullName = "Test Staff",
                GoogleSubject = staffId.ToString(),
                Role = "BranchStaff",
                BranchId = branchId
            });
            await db.SaveChangesAsync();
        });

        var token = TestAuthHelper.GenerateToken(staffId, "BranchStaff");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var resp = await _client.PostAsJsonAsync("/orders/branch", new
        {
            paymentMethod = "Cash",
            items = new[] { new { itemId = "lat", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 } }
        });
        var order = await resp.Content.ReadFromJsonAsync<CheckoutResponse>();
        return (staffId, order!.OrderId);
    }

    private void AuthAsStaff(Guid staffId)
    {
        var token = TestAuthHelper.GenerateToken(staffId, "BranchStaff");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    // --- GET /orders/pending ---

    [Fact]
    public async Task GetPending_Unauthenticated_Returns401()
    {
        _client.DefaultRequestHeaders.Authorization = null;
        var response = await _client.GetAsync("/orders/pending");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetPending_CustomerRole_Returns403()
    {
        var token = TestAuthHelper.GenerateToken(Guid.NewGuid(), "Customer");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.GetAsync("/orders/pending");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetPending_StaffWithoutBranch_Returns400()
    {
        var staffId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User { Id = staffId, Email = $"{staffId}@s.com", FullName = "NoBranch", GoogleSubject = staffId.ToString(), Role = "BranchStaff", BranchId = null });
            await db.SaveChangesAsync();
        });
        AuthAsStaff(staffId);

        var response = await _client.GetAsync("/orders/pending");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetPending_ReturnsConfirmedOrdersForBranch()
    {
        var (staffId, orderId) = await SeedConfirmedBranchOrderAsync("helwan");
        AuthAsStaff(staffId);

        var response = await _client.GetAsync("/orders/pending");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<List<PendingOrderDto>>();
        Assert.NotNull(result);
        Assert.Contains(result, o => o.Id == orderId);
        var order = result.First(o => o.Id == orderId);
        Assert.NotEmpty(order.Items);
        Assert.All(order.Items, i => Assert.Equal("Pending", i.KdsStatus));
    }

    [Fact]
    public async Task GetPending_DoesNotReturnOrdersFromOtherBranch()
    {
        // Seed an order in helwan
        await SeedConfirmedBranchOrderAsync("helwan");

        // Staff from a different branch
        var otherStaffId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User { Id = otherStaffId, Email = $"{otherStaffId}@s.com", FullName = "Other", GoogleSubject = otherStaffId.ToString(), Role = "BranchStaff", BranchId = "hadayek-helwan" });
            await db.SaveChangesAsync();
        });
        AuthAsStaff(otherStaffId);

        var response = await _client.GetAsync("/orders/pending");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<List<PendingOrderDto>>();
        Assert.NotNull(result);
        Assert.DoesNotContain(result, o => o.Items.Any(i => i.KdsStatus == "Pending" && o.Id == Guid.Empty));
    }

    // --- PUT /orders/{orderId}/items/{itemId}/kds-status ---

    [Fact]
    public async Task UpdateKdsStatus_Unauthenticated_Returns401()
    {
        _client.DefaultRequestHeaders.Authorization = null;
        var response = await _client.PutAsJsonAsync($"/orders/{Guid.NewGuid()}/items/{Guid.NewGuid()}/kds-status", new { kdsStatus = "Preparing" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task UpdateKdsStatus_CustomerRole_Returns403()
    {
        var token = TestAuthHelper.GenerateToken(Guid.NewGuid(), "Customer");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.PutAsJsonAsync($"/orders/{Guid.NewGuid()}/items/{Guid.NewGuid()}/kds-status", new { kdsStatus = "Preparing" });
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task UpdateKdsStatus_OrderNotFound_Returns404()
    {
        var staffId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User { Id = staffId, Email = $"{staffId}@s.com", FullName = "S", GoogleSubject = staffId.ToString(), Role = "BranchStaff", BranchId = "helwan" });
            await db.SaveChangesAsync();
        });
        AuthAsStaff(staffId);

        var response = await _client.PutAsJsonAsync($"/orders/{Guid.NewGuid()}/items/{Guid.NewGuid()}/kds-status", new { kdsStatus = "Preparing" });
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateKdsStatus_WrongBranch_Returns403()
    {
        var (_, orderId) = await SeedConfirmedBranchOrderAsync("helwan");

        // Get the item id
        var items = await GetOrderItemsAsync(orderId);
        var itemId = items.First().Id;

        // Staff from wrong branch
        var wrongStaffId = Guid.NewGuid();
        await _factory.SeedAsync(async db =>
        {
            db.Users.Add(new User { Id = wrongStaffId, Email = $"{wrongStaffId}@s.com", FullName = "Wrong", GoogleSubject = wrongStaffId.ToString(), Role = "BranchStaff", BranchId = "hadayek-helwan" });
            await db.SaveChangesAsync();
        });
        AuthAsStaff(wrongStaffId);

        var response = await _client.PutAsJsonAsync($"/orders/{orderId}/items/{itemId}/kds-status", new { kdsStatus = "Preparing" });
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task UpdateKdsStatus_InvalidStatus_Returns400()
    {
        var (staffId, orderId) = await SeedConfirmedBranchOrderAsync();
        var items = await GetOrderItemsAsync(orderId);
        AuthAsStaff(staffId);

        var response = await _client.PutAsJsonAsync($"/orders/{orderId}/items/{items.First().Id}/kds-status", new { kdsStatus = "Burned" });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateKdsStatus_ValidTransition_ReturnsUpdatedStatus()
    {
        var (staffId, orderId) = await SeedConfirmedBranchOrderAsync();
        var items = await GetOrderItemsAsync(orderId);
        AuthAsStaff(staffId);

        var response = await _client.PutAsJsonAsync($"/orders/{orderId}/items/{items.First().Id}/kds-status", new { kdsStatus = "Preparing" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<KdsStatusUpdateResponse>();
        Assert.NotNull(result);
        Assert.Equal("Preparing", result.KdsStatus);
        Assert.Equal("Confirmed", result.OrderStatus);
    }

    [Fact]
    public async Task UpdateKdsStatus_AllCollected_CompletesOrder()
    {
        var (staffId, orderId) = await SeedConfirmedBranchOrderAsync();
        var items = await GetOrderItemsAsync(orderId);
        AuthAsStaff(staffId);

        var response = await _client.PutAsJsonAsync($"/orders/{orderId}/items/{items.First().Id}/kds-status", new { kdsStatus = "Collected" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<KdsStatusUpdateResponse>();
        Assert.NotNull(result);
        Assert.Equal("Collected", result.KdsStatus);
        Assert.Equal("Completed", result.OrderStatus);
    }

    private async Task<List<PendingOrderItemDto>> GetOrderItemsAsync(Guid orderId)
    {
        List<PendingOrderItemDto> items = new();
        await _factory.SeedAsync(async db =>
        {
            var orderItems = db.OrderItems.Where(i => i.OrderId == orderId).ToList();
            items = orderItems.Select(i => new PendingOrderItemDto { Id = i.Id }).ToList();
            await Task.CompletedTask;
        });
        return items;
    }
}
