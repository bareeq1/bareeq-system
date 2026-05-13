using Ardalis.ApiEndpoints;
using Bareeq.Api.Data;
using Bareeq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Endpoints.Catalog;

public class GetCatalog : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<CatalogResponse>
{
    private readonly AppDbContext _dbContext;

    public GetCatalog(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("catalog")]
    [AllowAnonymous]
    public override async Task<ActionResult<CatalogResponse>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var categories = await _dbContext.Categories
            .AsNoTracking()
            .OrderBy(category => category.SortOrder)
            .Select(category => new CategoryDto
            {
                Id = category.Id,
                LabelEn = category.LabelEn,
                LabelAr = category.LabelAr,
                Glyph = category.Glyph,
                SortOrder = category.SortOrder
            })
            .ToListAsync(cancellationToken);

        var items = await _dbContext.Items
            .AsNoTracking()
            .OrderBy(item => item.SortOrder)
            .Select(item => new ItemDto
            {
                Id = item.Id,
                CategoryId = item.CategoryId,
                NameEn = item.NameEn,
                NameAr = item.NameAr,
                Description = item.Description,
                Price = item.Price,
                Tone = item.Tone,
                Flag = item.Flag,
                Calories = item.Calories,
                SortOrder = item.SortOrder
            })
            .ToListAsync(cancellationToken);

        var addons = await _dbContext.Addons
            .AsNoTracking()
            .OrderBy(addon => addon.SortOrder)
            .Select(addon => new AddonDto
            {
                Id = addon.Id,
                Label = addon.Label,
                Price = addon.Price,
                SortOrder = addon.SortOrder
            })
            .ToListAsync(cancellationToken);

        var milks = await _dbContext.Milks
            .AsNoTracking()
            .OrderBy(milk => milk.SortOrder)
            .Select(milk => new OptionDto
            {
                Id = milk.Id,
                Label = milk.Label,
                Delta = milk.Delta,
                SortOrder = milk.SortOrder
            })
            .ToListAsync(cancellationToken);

        var sizes = await _dbContext.Sizes
            .AsNoTracking()
            .OrderBy(size => size.SortOrder)
            .Select(size => new OptionDto
            {
                Id = size.Id,
                Label = size.Label,
                Delta = size.Delta,
                SortOrder = size.SortOrder
            })
            .ToListAsync(cancellationToken);

        return Ok(new CatalogResponse
        {
            Categories = categories,
            Items = items,
            Addons = addons,
            Milks = milks,
            Sizes = sizes
        });
    }
}
