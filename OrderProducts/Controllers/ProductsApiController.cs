using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderProducts.Entities;
using OrderProducts.Services.ProductService;

namespace OrderProducts.Controllers;

[AllowAnonymous]
public class ProductsApiController : BaseApiController
{
    private readonly IProductsService _productsService;

    public ProductsApiController(IProductsService productsService)
    {
        _productsService = productsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _productsService.GetProductsAsync();
        return HandleResult(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _productsService.GetProductByIdAsync(id);
        return HandleResult(product);
    }

    [HttpPost]
    public async Task<ActionResult> AddProduct(Product product)
    {
        var result = await _productsService.CreateProductAsync(product);
        return HandleResult(result);
    }

    [HttpGet("search/{searchText}")]
    public async Task<IActionResult> SearchProducts(string searchText)
    {
        var products = await _productsService.SearchProductsAsync(searchText);
        return HandleResult(products);
    }
}