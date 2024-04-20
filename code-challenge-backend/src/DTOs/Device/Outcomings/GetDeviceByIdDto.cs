namespace api.DTOs.Device.Outcomings;

public sealed class GetDeviceByIdDto
{
    public Guid Id { get; set; }

    public string Type { get; set; }

    public string Description { get; set; }
}
