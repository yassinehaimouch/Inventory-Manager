import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { DeviceComponent } from './device/device.component';

export const INVENTARY_ROUTES: Routes = [
  { path: 'employee', component: EmployeeComponent },
  { path: 'device', component: DeviceComponent },
  { path: '**', component: EmployeeComponent },
];
