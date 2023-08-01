using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderProducts.Dtos;
using OrderProducts.Entities;
using OrderProducts.Services.AuthService;

namespace OrderProducts.Controllers;

[AllowAnonymous]
public class UserApiController : BaseApiController
{
    private readonly IAuthService _authService;

    public UserApiController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegister userRegister)
    {
        var newUser = new User { Email = userRegister.Email, DateCreated = DateTimeOffset.Now };
        return HandleResult(await _authService.Register(newUser, userRegister.Password));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLogin login)
    {
        return HandleResult(await _authService.Login(login.Email, login.Password));
    }
}