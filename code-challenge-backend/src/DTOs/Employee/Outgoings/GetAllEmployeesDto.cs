namespace api.DTOs.Employee.Outgoings;

public sealed class GetAllEmployeesDto
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Email { get; set; }

    public IEnumerable<DeviceDto> Devices { get; set; }

    public sealed class DeviceDto
    {
        public Guid Id { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }
    }
}
