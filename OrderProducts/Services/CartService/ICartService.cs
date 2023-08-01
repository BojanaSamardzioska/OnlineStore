using OrderProducts.Common;
using OrderProducts.Dtos;
using OrderProducts.Entities;

namespace OrderProducts.Services.CartService;

public interface ICartService
{
    Task<Result<List<CartProductResponse>>> GetCartProducts(List<CartItem> cartItems);

    Task<Result<int>> GetCartItemsCount();

    Task<Result<bool>> AddToCart(CartItem item);

    Task<Result<bool>> UpdateQuantity(CartItem cartItem);

    Task<Result<bool>> RemoveItemFromCart(int productId);
    Task<Result<bool>> RemoveAllItemsFromCart();

    Task<Result<List<CartProductResponse>>> GetDbCartProducts(int? userId = null);
}