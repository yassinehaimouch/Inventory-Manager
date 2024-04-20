namespace Api.Entities;

public class Employee
{
    // Primary key.
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Email { get; set; }

    public IEnumerable<Device> Devices { get; set; }
}