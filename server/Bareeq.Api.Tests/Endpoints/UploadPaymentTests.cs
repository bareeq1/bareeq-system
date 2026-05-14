using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class UploadPaymentTests : IClassFixture<TestWebFactory>
{
    private readonly HttpClient _client;

    // Minimal valid JPEG header bytes
    private static readonly byte[] FakeJpeg = [0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01];

    public UploadPaymentTests(TestWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task<Guid> PlaceOrderAsync()
    {
        var token = TestAuthHelper.GenerateToken(Guid.NewGuid());
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.PostAsJsonAsync("/orders/checkout", new
        {
            branchId = "helwan",
            deliveryMethod = "Pickup",
            items = new[]
            {
                new { itemId = "cap", sizeId = "single", milkId = "fresh", addonIds = Array.Empty<string>(), quantity = 1 }
            }
        });

        var result = await response.Content.ReadFromJsonAsync<CheckoutResponse>();
        return result!.OrderId;
    }

    private static MultipartFormDataContent BuildImageForm(byte[] bytes, string contentType = "image/jpeg", string fileName = "receipt.jpg")
    {
        var form = new MultipartFormDataContent();
        var content = new ByteArrayContent(bytes);
        content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        form.Add(content, "file", fileName);
        return form;
    }

    [Fact]
    public async Task UploadPayment_Unauthenticated_Returns401()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.PostAsync($"/orders/{Guid.NewGuid()}/payment", BuildImageForm(FakeJpeg));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task UploadPayment_OrderNotFound_Returns404()
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TestAuthHelper.GenerateToken(Guid.NewGuid()));

        var response = await _client.PostAsync($"/orders/{Guid.NewGuid()}/payment", BuildImageForm(FakeJpeg));

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UploadPayment_OtherUsersOrder_ReturnsForbid()
    {
        var orderId = await PlaceOrderAsync();

        // Switch to a different user
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TestAuthHelper.GenerateToken(Guid.NewGuid()));

        var response = await _client.PostAsync($"/orders/{orderId}/payment", BuildImageForm(FakeJpeg));

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task UploadPayment_NoFile_Returns400()
    {
        var orderId = await PlaceOrderAsync();

        var form = new MultipartFormDataContent();
        var response = await _client.PostAsync($"/orders/{orderId}/payment", form);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UploadPayment_InvalidFileType_Returns400()
    {
        var orderId = await PlaceOrderAsync();

        var response = await _client.PostAsync($"/orders/{orderId}/payment",
            BuildImageForm([0x25, 0x50, 0x44, 0x46], "application/pdf", "doc.pdf"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UploadPayment_ValidJpeg_ReturnsPaymentId()
    {
        var orderId = await PlaceOrderAsync();

        var response = await _client.PostAsync($"/orders/{orderId}/payment", BuildImageForm(FakeJpeg));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<PaymentSubmissionResponse>();
        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.PaymentId);
        Assert.Equal("Pending", result.Status);
    }

    [Fact]
    public async Task UploadPayment_DuplicateSubmission_Returns400()
    {
        var orderId = await PlaceOrderAsync();

        await _client.PostAsync($"/orders/{orderId}/payment", BuildImageForm(FakeJpeg));
        var secondResponse = await _client.PostAsync($"/orders/{orderId}/payment", BuildImageForm(FakeJpeg));

        Assert.Equal(HttpStatusCode.BadRequest, secondResponse.StatusCode);
    }
}
