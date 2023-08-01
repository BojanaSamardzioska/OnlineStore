namespace OrderProducts.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public byte[] PasswordHash { get; set; } = new byte [1];
    public byte[] PasswordSalt { get; set; } = new byte [1];
    public DateTimeOffset DateCreated { get; set; } = DateTimeOffset.Now;
}