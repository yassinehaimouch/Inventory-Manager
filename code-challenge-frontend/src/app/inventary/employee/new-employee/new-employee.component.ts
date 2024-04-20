import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceService } from '../../../core/services/device.service';
import { FilterDevicePipe } from '../../../shared/pipes/filter-device.pipe';
import { Device } from '../../../core/interfaces/device.interface';

@Component({
  selector: 'app-new-employee',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    FilterDevicePipe,
  ],
  templateUrl: 'new-employee.component.html',
  styleUrl: './new-employee.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewEmployeeComponent implements OnInit {
  myForm: FormGroup;
  devices: Device[] = [];
  selectedItems: string[] = [];
  selectedDevices: Device[] = [];
  hasAvailableDevices: boolean = false;
  isDevicesLoaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public employeeDetail: any,
    private formBuilder: FormBuilder,
    private ref: MatDialogRef<NewEmployeeComponent>,
    public deviceService: DeviceService
  ) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      select: [''],
    });
  }

  ngOnInit(): void {
    this.getDeviceList();
    if (this.employeeDetail) {
      const { name, email, devices } = this.employeeDetail;
      this.myForm.controls['name'].setValue(name);
      this.myForm.controls['email'].setValue(email);
      this.selectedDevices = devices;
    }
  }

  getDeviceList() {
    this.deviceService.getDevice().subscribe((resp: any) => {
      this.devices = resp;
      this.hasAvailableDevices = this.devices.some(
        (device: Device) => device.isTaken === false
      );
      this.isDevicesLoaded = true;
    });
  }

  selectedChange(change: any) {
    let selectedItems = change.value;
    this.devices.forEach((item1: any) => {
      if (item1 && item1.id === selectedItems) {
        const index = this.selectedDevices.findIndex(
          (item) => item.id === selectedItems
        );
        if (index === -1) {
          this.selectedDevices.push({
            id: item1.id,
            type: item1.type,
            description: item1.description,
          });
        }
      }
    });
  }

  delete(device: any) {
    const removedDevice = { ...device, isTaken: false };
    this.devices.push(removedDevice);
    this.hasAvailableDevices = this.devices.some(
      (device: Device) => device.isTaken === false
    );
    this.selectedDevices = this.selectedDevices.filter(
      (item) => item.id !== device.id
    );
  }

  saveDialog(mode: 'create' | 'update') {
    this.ref.close({
      name: this.myForm.value.name,
      email: this.myForm.value.email,
      devices: this.selectedDevices.map((device) => device.id),
      mode,
    });
  }
}
