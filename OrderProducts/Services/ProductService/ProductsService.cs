using Microsoft.EntityFrameworkCore;
using OrderProducts.Common;
using OrderProducts.Data;
using OrderProducts.Entities;

namespace OrderProducts.Services.ProductService
{
    public class ProductsService : IProductsService
    {
        private readonly ApplicationDataContext _context;

        public ProductsService(ApplicationDataContext context)
        {
            _context = context;
        }

        public async Task<Result<Product>> CreateProductAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            var result = await _context.SaveChangesAsync() > 0;

            return result
                ? Result<Product>.Success(product)
                : Result<Product>.Failure("Failed to create product");
        }

        public async Task<Result<Product>> GetProductByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);

            return product == null
                ? Result<Product>.Failure("Product not found")
                : Result<Product>.Success(product);
        }

        public async Task<Result<IReadOnlyList<Product>>> SearchProductsAsync(string searchText)
        {
            var products = await _context.Products
                .Where(x => x.Name.ToLower().Contains(searchText.Trim().ToLower()))
                .AsNoTracking()
                .ToListAsync();

            return Result<IReadOnlyList<Product>>.Success(products);
        }

        public async Task<Result<IReadOnlyList<Product>>> GetProductsAsync()
        {
            var products = await _context.Products.OrderByDescending(p => p.Price)
                .AsNoTracking()
                .ToListAsync();

            return Result<IReadOnlyList<Product>>.Success(products);
        }
    }
}