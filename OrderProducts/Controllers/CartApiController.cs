using Microsoft.AspNetCore.Mvc;
using OrderProducts.Entities;
using OrderProducts.Services.CartService;

namespace OrderProducts.Controllers;

public class CartApiController : BaseApiController
{
    private readonly ICartService _cartService;

    public CartApiController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpPost("add-to-cart")]
    public async Task<ActionResult> AddToCart(CartItem request)
    {
        var result = await _cartService.AddToCart(request);
        return HandleResult(result);
    }

    [HttpPut("update-quantity")]
    public async Task<ActionResult> UpdateQuantity(CartItem cartItem)
    {
        var result = await _cartService.UpdateQuantity(cartItem);
        return HandleResult(result);
    }

    [HttpGet("count")]
    public async Task<ActionResult> GetCartItemsCount()
    {
        var result = await _cartService.GetCartItemsCount();
        return HandleResult(result);
    }

    [HttpDelete("delete-cart-item/{productId:int}")]
    public async Task<ActionResult> RemoveItemFromCart(int productId)
    {
        var result = await _cartService.RemoveItemFromCart(productId);
        return HandleResult(result);
    }


    [HttpDelete("delete-cart-items")]
    public async Task<ActionResult> RemoveItemsFromCart()
    {
        var result = await _cartService.RemoveAllItemsFromCart();
        return HandleResult(result);
    }

    [HttpGet("cart-products")]
    public async Task<ActionResult> GetDbCartProducts()
    {
        var result = await _cartService.GetDbCartProducts();
        return HandleResult(result);
    }
}