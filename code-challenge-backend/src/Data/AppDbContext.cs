using Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options: options) { }

  public DbSet<Employee> Employees { get; set; }

  public DbSet<Device> Devices { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    const string TEXT = "TEXT";

    modelBuilder.Entity<Device>(builder =>
    {
      builder.ToTable("Devices");

      builder.HasKey(device => device.Id);

      builder
        .Property(device => device.Type)
        .HasColumnType(TEXT)
        .IsRequired();

      builder
        .Property(device => device.Description)
        .HasColumnType(TEXT)
        .IsRequired();

      builder
        .Property(device => device.EmployeeId)
        .IsRequired();
    });

    modelBuilder.Entity<Employee>(builder =>
    {
      builder.ToTable("Employees");

      builder.HasKey(employee => employee.Id);

      builder
        .Property(employee => employee.Name)
        .HasColumnType(TEXT)
        .IsRequired();

      builder
        .Property(employee => employee.Email)
        .HasColumnType(TEXT)
        .IsRequired();

      builder
        .HasMany(employee => employee.Devices)
        .WithOne(device => device.Employee)
        .HasForeignKey(device => device.EmployeeId)
        .OnDelete(DeleteBehavior.Cascade);
    });
  }
}