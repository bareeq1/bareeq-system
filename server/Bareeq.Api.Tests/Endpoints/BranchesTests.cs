using System.Net.Http.Json;
using Bareeq.Api.Models;
using Bareeq.Api.Tests.Infrastructure;

namespace Bareeq.Api.Tests.Endpoints;

public class BranchesTests : IClassFixture<TestWebFactory>
{
    private readonly HttpClient _client;

    public BranchesTests(TestWebFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetBranches_ReturnsOk_WithSeededBranches()
    {
        var response = await _client.GetAsync("/branches");

        response.EnsureSuccessStatusCode();
        var branches = await response.Content.ReadFromJsonAsync<List<BranchDto>>();
        Assert.NotNull(branches);
        Assert.Equal(2, branches.Count);
        Assert.Contains(branches, b => b.Id == "helwan");
        Assert.Contains(branches, b => b.Id == "hadayek-helwan");
    }

    [Fact]
    public async Task GetBranches_ReturnsCorrectFields()
    {
        var response = await _client.GetAsync("/branches");

        var branches = await response.Content.ReadFromJsonAsync<List<BranchDto>>();
        var helwan = branches!.First(b => b.Id == "helwan");

        Assert.Equal("Helwan", helwan.Label);
        Assert.NotEmpty(helwan.Address);
        Assert.NotEmpty(helwan.Phone);
        Assert.NotEmpty(helwan.Hours);
    }
}
