using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OrderProducts.Common;
using OrderProducts.Data;
using OrderProducts.Dtos;
using OrderProducts.Entities;

namespace OrderProducts.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;
    private readonly ApplicationDataContext _dbContext;
    private readonly IHttpContextAccessor _contextAccessor;

    public AuthService(ApplicationDataContext dbContext, IConfiguration config, IHttpContextAccessor contextAccessor)
    {
        _dbContext = dbContext;
        _config = config;
        _contextAccessor = contextAccessor;
    }

    public async Task<Result<int>> Register(User user, string password)
    {
        if (await AnyAsync(user))
        {
            return Result<int>.Failure("User with Email already exists");
        }

        CreatePasswordHash(password, out var passwordHash, out var passwordSalt);
        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        await _dbContext.Users.AddAsync(user);
        var result = await _dbContext.SaveChangesAsync() > 0;

        return result
            ? Result<int>.Success(user.Id)
            : Result<int>.Failure("Failed to register user");
    }

    public async Task<Result<UserDto>> Login(string email, string password)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
        if (user == null)
            return Result<UserDto>.Failure("User not found");

        if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            return Result<UserDto>.Failure("Invalid password");

        var userDto = new UserDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Token = CreateToken(user)
        };
        
        return Result<UserDto>.Success(userDto);
    }

    public int GetCurrentUserId()
    {
        return int.Parse(_contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
    }

    public string GetUserEmail()
    {
        return _contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    }

    #region Private methods

    private async Task<bool> AnyAsync(User user)
    {
        return await _dbContext.Users.AnyAsync(x => x.Email.ToLower() == user.Email.ToLower());
    }

    private static bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512(passwordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computedHash.SequenceEqual(passwordHash);
    }

    private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512();
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }

    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AppSettings:Token"] ?? string.Empty));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: credentials,
            issuer: _config["AppSettings:Issuer"],
            audience: _config["AppSettings:Audience"]);

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }

    #endregion
}