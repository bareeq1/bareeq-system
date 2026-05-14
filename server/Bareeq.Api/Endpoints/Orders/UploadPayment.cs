using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Entities;
using Bareeq.Api.Models;
using Bareeq.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Bareeq.Api.Endpoints.Orders;

public class UploadPayment : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<PaymentSubmissionResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly IBlobStorageService _blobStorage;
    private readonly IEmailService _emailService;

    public UploadPayment(AppDbContext dbContext, IBlobStorageService blobStorage, IEmailService emailService)
    {
        _dbContext = dbContext;
        _blobStorage = blobStorage;
        _emailService = emailService;
    }

    [HttpPost("orders/{orderId:guid}/payment")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public override async Task<ActionResult<PaymentSubmissionResponse>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subject = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(subject) || !Guid.TryParse(subject, out var userId))
            return Unauthorized();

        var orderId = Guid.Parse((string)RouteData.Values["orderId"]!);

        var order = await _dbContext.Orders
            .Include(o => o.Payment)
            .Include(o => o.Branch)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
            return NotFound();

        if (order.UserId != userId)
            return Forbid();

        if (order.Status != "Placed")
            return BadRequest("Payment can only be submitted for orders in Placed status.");

        if (order.Payment is not null)
            return BadRequest("Payment has already been submitted for this order.");

        var file = Request.Form.Files.FirstOrDefault();
        if (file is null || file.Length == 0)
            return BadRequest("No payment image uploaded.");

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return BadRequest("Only JPEG, PNG, or WebP images are accepted.");

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("Image must be under 5 MB.");

        var fileName = $"payments/{orderId}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        string imageUrl;
        await using (var stream = file.OpenReadStream())
        {
            imageUrl = await _blobStorage.UploadAsync(stream, fileName, file.ContentType, cancellationToken);
        }

        var payment = new OrderPayment
        {
            OrderId = order.Id,
            ImageUrl = imageUrl,
            Status = "Pending",
            SubmittedAt = DateTimeOffset.UtcNow
        };

        _dbContext.OrderPayments.Add(payment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        order.PaymentId = payment.Id;
        await _dbContext.SaveChangesAsync(cancellationToken);

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        var admins = await _dbContext.Users
            .Where(u => u.Role == "Admin")
            .ToListAsync(cancellationToken);

        foreach (var admin in admins)
        {
            await _emailService.SendPaymentSubmittedToAdminAsync(
                admin.Email,
                admin.FullName,
                order.Id,
                user?.FullName ?? "Customer",
                order.Subtotal + order.DeliveryFee,
                order.Branch?.Label ?? order.BranchId ?? string.Empty,
                imageUrl,
                cancellationToken);
        }

        return Ok(new PaymentSubmissionResponse
        {
            PaymentId = payment.Id,
            Status = payment.Status,
            Message = "Payment receipt submitted. Awaiting admin approval."
        });
    }
}
