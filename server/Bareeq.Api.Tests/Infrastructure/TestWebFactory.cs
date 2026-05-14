using Bareeq.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Bareeq.Api.Tests.Infrastructure;

public class TestWebFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:SigningKey"] = TestAuthHelper.SigningKey,
                ["Jwt:Issuer"] = "bareeq-api",
                ["Jwt:Audience"] = "bareeq-spa"
            });
        });

        builder.ConfigureServices(services =>
        {
            // Remove all DbContext-related registrations (Postgres)
            var toRemove = services
                .Where(d => d.ServiceType == typeof(AppDbContext)
                         || d.ServiceType == typeof(DbContextOptions<AppDbContext>)
                         || (d.ServiceType.IsGenericType &&
                             d.ServiceType.Name.StartsWith("IDbContextOptionsConfiguration")))
                .ToList();
            toRemove.ForEach(d => services.Remove(d));

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("bareeq-tests"));
        });
    }

    public async Task SeedAsync(Func<AppDbContext, Task> seeder)
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await seeder(db);
    }
}
