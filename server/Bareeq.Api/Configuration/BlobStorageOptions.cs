namespace Bareeq.Api.Configuration;

public class BlobStorageOptions
{
    public const string SectionName = "BlobStorage";
    public string ConnectionString { get; set; } = string.Empty;
    public string ContainerName { get; set; } = "payment-receipts";
    public string PublicBaseUrl { get; set; } = string.Empty;
}
