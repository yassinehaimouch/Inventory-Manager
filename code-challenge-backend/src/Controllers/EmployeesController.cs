using api.Common;
using api.DTOs.Employee.Incoming;
using api.DTOs.Employee.Outgoings;
using Api.Data;
using Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _context;

    public EmployeesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var foundEmployees = await _context.Employees
            .AsNoTracking()
            .Where(employee => employee.Id != CommonConstant.DEFAULT_ID_FOR_ENTITY)
            .Select(employee => new GetAllEmployeesDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Devices = employee.Devices.Select(device => new GetAllEmployeesDto.DeviceDto
                {
                    Id = device.Id,
                    Type = device.Type,
                    Description = device.Description
                })
            })
            .ToListAsync(cancellationToken: cancellationToken);

        return Ok(value: foundEmployees);
    }

    [HttpGet("{employeeId:guid}")]
    public async Task<IActionResult> GetAllAsync(
        [FromRoute]
        [Required]
            Guid employeeId,
        CancellationToken cancellationToken)
    {
        var isEmployeeFound = await _context.Employees.AnyAsync(
            predicate: employee => employee.Id == employeeId,
            cancellationToken: cancellationToken);

        if (!isEmployeeFound)
        {
            return NotFound();
        }

        var foundEmployees = await _context.Employees
            .AsNoTracking()
            .Where(employee =>
                employee.Id != CommonConstant.DEFAULT_ID_FOR_ENTITY &&
                employee.Id == employeeId)
            .Select(employee => new GetEmployeeByIdDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Devices = employee.Devices.Select(device => new GetEmployeeByIdDto.DeviceDto
                {
                    Id = device.Id,
                    Type = device.Type,
                    Description = device.Description
                })
            })
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        return Ok(value: foundEmployees);
    }

    [HttpPut]
    public async Task<IActionResult> CreateAsync(
        [FromBody]
        [Required]
            CreateEmployeeDto dto,
        CancellationToken cancellationToken)
    {
        var isUserFound = await _context.Employees.AnyAsync(
            predicate: employee =>
                employee.Email.Equals(dto.Email) &&
                employee.Name.Equals(dto.Name),
            cancellationToken: cancellationToken);

        if (isUserFound)
        {
            return Conflict();
        }

        Employee newEmployee = new()
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email
        };

        await _context.Employees.AddAsync(
            entity: newEmployee,
            cancellationToken: cancellationToken);

        try
        {
            await _context.SaveChangesAsync(cancellationToken: cancellationToken);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        return Ok(newEmployee.Id);
    }

    [HttpDelete("{employeeId:guid}")]
    public async Task<IActionResult> DeleteAsync(
    [FromRoute]
    [Required]
        Guid employeeId,
    CancellationToken cancellationToken)
    {
        var isEmployeeFound = await _context.Employees
            .Include(e => e.Devices)
            .AnyAsync(e => e.Id == employeeId, cancellationToken);

        if (!isEmployeeFound)
        {
            return NotFound();
        }

        var employee = await _context.Employees
            .Include(e => e.Devices)
            .SingleOrDefaultAsync(e => e.Id == employeeId, cancellationToken);

        if (employee.Devices.Any())
        {
            foreach (var device in employee.Devices)
            {
                device.EmployeeId = CommonConstant.DEFAULT_ID_FOR_ENTITY;
                _context.Devices.Update(device);
            }
        }

        _context.Remove(employee);

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        return Ok();
    }

    [HttpPatch("{employeeId:guid}")]
    public async Task<IActionResult> UpdateEmployeeInfoAsync(
        [FromRoute]
        [Required]
            Guid employeeId,
        [FromBody]
        [Required]
            UpdateEmployeeDto dto,
        CancellationToken cancellationToken)
    {
        var isEmployeeFound = await _context.Employees.AnyAsync(
            predicate: employee => employee.Id == employeeId,
            cancellationToken: cancellationToken);

        if (!isEmployeeFound)
        {
            return NotFound($"Employee with id = {employeeId} is found.");
        }

        var executionResult = false;

        _context.Database
            .CreateExecutionStrategy()
            .Execute(operation: () =>
            {
                using var transaction = _context.Database.BeginTransaction();

                try
                {
                    _context.Employees
                        .Where(employee => employee.Id == employeeId)
                        .ExecuteUpdate(setter => setter
                            .SetProperty(
                                employee => employee.Name,
                                dto.Name)
                            .SetProperty(
                                employee => employee.Email,
                                dto.Email));

                    transaction.Commit();

                    executionResult = true;
                }
                catch
                {
                    transaction.Rollback();
                }
            });

        if (!executionResult)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        return Ok();
    }

    [HttpPatch(template: "devices/{employeeId:guid}")]
    public async Task<IActionResult> UpdateDevicesAsync(
        [FromRoute]
        [Required]
            Guid employeeId,
        [FromBody]
        [Required]
            UpdateEmployeeDevicesDto dto,
        CancellationToken cancellationToken)
    {
        var isEmployeeFound = await _context.Employees.AnyAsync(
            predicate: employee => employee.Id == employeeId,
            cancellationToken: cancellationToken);

        if (!isEmployeeFound)
        {
            return NotFound($"Employee with id = {employeeId} is found.");
        }

        foreach (var deviceId in dto.DeviceIds)
        {
            var isDeviceFound = await _context.Devices.AnyAsync(
                predicate: device => device.Id == deviceId,
                cancellationToken: cancellationToken);

            if (!isDeviceFound)
            {
                return NotFound($"Device with id = {deviceId} is not found.");
            }
        }

        var executionResult = false;

        _context.Database
            .CreateExecutionStrategy()
            .Execute(operation: () =>
            {
                using var transaction = _context.Database.BeginTransaction();

                try
                {
                    _context.Devices
                        .Where(device => device.EmployeeId == employeeId)
                        .ExecuteUpdate(setter => setter.SetProperty(
                            device => device.EmployeeId,
                            CommonConstant.DEFAULT_ID_FOR_ENTITY));

                    foreach (var newDevice in dto.DeviceIds)
                    {
                        _context.Devices
                            .Where(device => device.Id == newDevice)
                            .ExecuteUpdate(setter => setter.SetProperty(
                                device => device.EmployeeId,
                                employeeId));
                    }

                    transaction.Commit();

                    executionResult = true;
                }
                catch
                {
                    transaction.Rollback();
                }
            });

        if (!executionResult)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        return Ok();
    }
}
