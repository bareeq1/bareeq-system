namespace Bareeq.Api.Models;

public class ApprovePaymentRequest
{
    public bool Approved { get; set; }
    public string? RejectionReason { get; set; }
}
