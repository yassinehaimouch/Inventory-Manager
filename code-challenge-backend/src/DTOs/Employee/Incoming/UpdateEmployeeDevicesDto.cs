using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Employee.Incoming;

public sealed class UpdateEmployeeDevicesDto
{
    [Required]
    public IEnumerable<Guid> DeviceIds { get; set; }
}
