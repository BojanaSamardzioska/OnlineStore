using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderProducts.Common;
using OrderProducts.Data;
using OrderProducts.Dtos;
using OrderProducts.Entities;
using OrderProducts.Services.AuthService;

namespace OrderProducts.Services.CartService;

public class CartService : ICartService
{
    private readonly IAuthService _authService;
    private readonly ApplicationDataContext _context;

    public CartService(IAuthService authService, ApplicationDataContext context)
    {
        _authService = authService;
        _context = context;
    }

    public async Task<Result<List<CartProductResponse>>> GetCartProducts(List<CartItem> cartItems)
    {
        var cartProducts = new List<CartProductResponse>();

        foreach (var item in cartItems)
        {
            var product = await _context.Products
                .Where(p => p.Id == item.ProductId)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                continue;
            }

            var cartProduct = new CartProductResponse
            {
                ProductId = product.Id,
                Title = product.Name,
                ImageUrl = product.PictureUrl,
                Price = product.Price,
                Quantity = item.Quantity
            };
            cartProducts.Add(cartProduct);
        }

        return Result<List<CartProductResponse>>.Success(cartProducts);
    }

    public async Task<Result<int>> GetCartItemsCount()
    {
        var count = (await _context.CartItems.Where(ci =>
                ci.UserId == _authService.GetCurrentUserId())
            .ToListAsync()).Count;
        return Result<int>.Success(count);
    }

    public async Task<Result<bool>> AddToCart(CartItem cartItem)
    {
        cartItem.UserId = _authService.GetCurrentUserId();

        var sameItem = await _context.CartItems
            .FirstOrDefaultAsync(ci =>
                ci.ProductId == cartItem.ProductId &&
                ci.UserId == cartItem.UserId);

        if (sameItem == null)
            await _context.CartItems.AddAsync(cartItem);
        else
            sameItem.Quantity += cartItem.Quantity;

        await _context.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> UpdateQuantity(CartItem cartItem)
    {
        var dbCartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci =>
                ci.ProductId == cartItem.ProductId &&
                ci.UserId == _authService.GetCurrentUserId());

        if (dbCartItem == null)
            return Result<bool>.Failure("cart item does not exist.");

        dbCartItem.Quantity = cartItem.Quantity;
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> RemoveItemFromCart(int productId)
    {
        var dbCartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci =>
                ci.ProductId == productId &&
                ci.UserId == _authService.GetCurrentUserId());
        if (dbCartItem == null)
            return Result<bool>.Failure("cart item does not exist.");

        _context.CartItems.Remove(dbCartItem);
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    public async Task<Result<List<CartProductResponse>>> GetDbCartProducts(int? userId = null)
    {
        if(userId == null)
            userId = _authService.GetCurrentUserId();

        return await GetCartProducts(await _context.CartItems
            .Where(ci => ci.UserId == userId).ToListAsync());
    }

    public async Task<Result<bool>> RemoveAllItemsFromCart()
    {
        var cartItems = await _context.CartItems.ToListAsync();
        
        foreach(var cartItem in cartItems)
        {
            var dbCartItem = await _context.CartItems.FirstOrDefaultAsync(
                ci => ci.UserId == _authService.GetCurrentUserId() 
                && ci.ProductId == cartItem.ProductId);
            if (dbCartItem == null)
                return Result<bool>.Failure("Cart item does not exist.");

            _context.CartItems.Remove(dbCartItem);
            await _context.SaveChangesAsync();
        }

        return Result<bool>.Success(true);
    }
}