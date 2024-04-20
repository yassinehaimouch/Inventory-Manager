using api.Common;
using api.DTOs.Device.Incomings;
using api.DTOs.Device.Outcomings;
using Api.Data;
using Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public sealed class DevicesController : ControllerBase
{
    private readonly AppDbContext _context;

    public DevicesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var foundDevices = await _context.Devices
            .AsNoTracking()
            .Select(selector: device => new GetAllDevicesDto
            {
                Id = device.Id,
                Type = device.Type,
                Description = device.Description,
                IsTaken = device.EmployeeId != CommonConstant.DEFAULT_ID_FOR_ENTITY
            })
            .ToListAsync(cancellationToken: cancellationToken);

        return Ok(foundDevices);
    }

    [HttpGet("{deviceId:guid}")]
    public async Task<IActionResult> GetByIdAsync(
        [FromRoute]
        [Required]
            Guid deviceId,
        CancellationToken cancellationToken)
    {
        var isDeviceFound = await _context.Devices.AnyAsync(
            predicate: device => device.Id == deviceId,
            cancellationToken: cancellationToken);

        if (!isDeviceFound)
        {
            return NotFound();
        }

        var foundDevice = await _context.Devices
            .AsNoTracking()
            .Where(device => device.Id == deviceId)
            .Select(selector: device => new GetDeviceByIdDto
            {
                Id = device.Id,
                Type = device.Type,
                Description = device.Description
            })
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        return Ok(foundDevice);
    }

    [HttpPut]
    public async Task<IActionResult> CreateAsync(
        [FromBody]
        [Required]
            CreateDeviceDto dto,
        CancellationToken cancellationToken)
    {
        Device newDevice = new()
        {
            Id = Guid.NewGuid(),
            Type = dto.Type,
            Description = dto.Description,
            EmployeeId = CommonConstant.DEFAULT_ID_FOR_ENTITY
        };

        await _context.Devices.AddAsync(
            entity: newDevice,
            cancellationToken: cancellationToken);

        await _context.SaveChangesAsync(
            cancellationToken: cancellationToken);

        return Ok();
    }

    [HttpDelete(template: "{deviceId:guid}")]
    public async Task<IActionResult> DeleteAsync(
        [FromRoute]
        [Required]
            Guid deviceId,
        CancellationToken cancellationToken)
    {
        var isDeviceFound = await _context.Devices.AnyAsync(
            predicate: device => device.Id == deviceId,
            cancellationToken: cancellationToken);

        if (!isDeviceFound)
        {
            return NotFound();
        }

        Device removedDevice = new()
        {
            Id = deviceId
        };

        _context.Remove(entity: removedDevice);

        await _context.SaveChangesAsync(cancellationToken: cancellationToken);

        return Ok();
    }

    [HttpPatch(template: "{deviceId:guid}")]
    public async Task<IActionResult> updateAsync(
        [FromRoute]
        [Required]
            Guid deviceId,
        [FromBody]
        [Required]
            UpdateDeviceDto dto,
        CancellationToken cancellationToken)
    {
        var isDeviceFound = await _context.Devices.AnyAsync(
            predicate: device => device.Id == deviceId,
            cancellationToken: cancellationToken);

        if (!isDeviceFound)
        {
            return NotFound();
        }

        var foundDevice = await _context.Devices
            .Where(predicate: device => device.Id == deviceId)
            .Select(selector: device => new Device
            {
                Id = device.Id,
                Type = device.Type,
                Description = device.Description,
                EmployeeId = device.EmployeeId
            })
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        foundDevice.Type = dto.Type;
        foundDevice.Description = dto.Description;

        _context.Update(foundDevice);

        await _context.SaveChangesAsync(cancellationToken: cancellationToken);

        return Ok();
    }
}
