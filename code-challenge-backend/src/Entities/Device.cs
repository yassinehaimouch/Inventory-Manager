namespace Api.Entities;

public class Device
{
    // Primary key.
    public Guid Id { get; set; }

    public string Type { get; set; }

    public string Description { get; set; }

    // Foreign key.
    public Guid EmployeeId { get; set; }

    // Navigation properties.
    public Employee Employee { get; set; }
}