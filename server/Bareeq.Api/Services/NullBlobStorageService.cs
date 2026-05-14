namespace Bareeq.Api.Services;

public class NullBlobStorageService : IBlobStorageService
{
    public Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        // Phase 3: replace with real Azure Blob / S3 implementation
        return Task.FromResult($"https://placeholder.blob.core.windows.net/{fileName}");
    }
}
