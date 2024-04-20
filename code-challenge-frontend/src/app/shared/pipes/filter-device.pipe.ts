import { Pipe, PipeTransform } from '@angular/core';
import { Device } from '../../core/interfaces/device.interface';

@Pipe({
  name: 'filterDevice',
  standalone: true,
})
export class FilterDevicePipe implements PipeTransform {
  transform(value: Device[], selectedDevices?: Device[]): Device[] {
    if (!value || !Array.isArray(value)) {
      return [];
    }
    return value.filter((device: Device) => {
      return (
        !selectedDevices.some(
          (selectedDevice) => selectedDevice.id === device.id
        ) && !device.isTaken
      );
    });
  }
}
