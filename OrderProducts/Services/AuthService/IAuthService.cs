using OrderProducts.Common;
using OrderProducts.Dtos;
using OrderProducts.Entities;

namespace OrderProducts.Services.AuthService;

public interface IAuthService
{
    Task<Result<int>> Register(User user, string password);
    
    Task<Result<UserDto>> Login(string email, string password);
    
    int GetCurrentUserId();
}