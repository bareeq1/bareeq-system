namespace Bareeq.Api.Services;

public class LocalBlobStorageService : IBlobStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LocalBlobStorageService(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
    {
        _env = env;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var uploadsPath = Path.Combine(_env.WebRootPath, "uploads", Path.GetDirectoryName(fileName) ?? "");
        Directory.CreateDirectory(uploadsPath);

        var fullPath = Path.Combine(_env.WebRootPath, "uploads", fileName);
        await using var file = new FileStream(fullPath, FileMode.Create, FileAccess.Write);
        await stream.CopyToAsync(file, cancellationToken);

        var request = _httpContextAccessor.HttpContext!.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        return $"{baseUrl}/uploads/{fileName.Replace('\\', '/')}";
    }
}
