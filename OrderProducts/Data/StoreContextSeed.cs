using Microsoft.EntityFrameworkCore;
using OrderProducts.Entities;
using System.Text.Json;

namespace OrderProducts.Data;

public static class StoreContextSeed
{
    public static async Task SeedAsync(ApplicationDataContext context)
    {
        if (await context.Products.AnyAsync()) return;

        var productsData = await File.ReadAllTextAsync("Data/SeedData/products.json");
        var products = JsonSerializer.Deserialize<List<Product>>(productsData);
        if (products != null)
        {
            await context.Products.AddRangeAsync(products);
        }

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}