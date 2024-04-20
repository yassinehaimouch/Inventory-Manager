using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Device.Incomings;

public sealed class UpdateDeviceDto
{
    [Required]
    public string Type { get; set; }

    [Required]
    public string Description { get; set; }
}
