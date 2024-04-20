namespace api.DTOs.Device.Outcomings;

public sealed class GetAllDevicesDto
{
    public Guid Id { get; set; }

    public string Type { get; set; }

    public string Description { get; set; }

    public bool IsTaken { get; set; }
}
