using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Bareeq.Api.Configuration;
using Microsoft.Extensions.Options;

namespace Bareeq.Api.Services;

public class AzureBlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly BlobStorageOptions _options;

    public AzureBlobStorageService(IOptions<BlobStorageOptions> options)
    {
        _options = options.Value;
        _blobServiceClient = new BlobServiceClient(_options.ConnectionString);
    }

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var container = _blobServiceClient.GetBlobContainerClient(_options.ContainerName);
        await container.CreateIfNotExistsAsync(PublicAccessType.Blob, cancellationToken: cancellationToken);

        var blob = container.GetBlobClient(fileName);
        await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType }, cancellationToken: cancellationToken);

        return blob.Uri.ToString();
    }
}
