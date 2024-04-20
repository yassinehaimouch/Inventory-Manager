using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Employee.Incoming;

public sealed class CreateEmployeeDto
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string Email { get; set; }
}
