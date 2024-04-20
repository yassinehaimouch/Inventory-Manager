using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Employee.Incoming;

public sealed class UpdateEmployeeDto
{
    [Required]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }
}
