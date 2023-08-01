using System.ComponentModel.DataAnnotations;

namespace OrderProducts.Entities;

public class BaseEntity
{
    [Required]
    public int Id { get; set; }
}