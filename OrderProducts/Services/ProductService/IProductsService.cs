using OrderProducts.Common;
using OrderProducts.Entities;

namespace OrderProducts.Services.ProductService;

public interface IProductsService
{
    Task<Result<Product>> CreateProductAsync(Product product);

    Task<Result<IReadOnlyList<Product>>> GetProductsAsync();

    Task<Result<Product>> GetProductByIdAsync(int id);
    Task<Result<IReadOnlyList<Product>>> SearchProductsAsync(string searchText);
}