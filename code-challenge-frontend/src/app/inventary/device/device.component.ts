import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { NewDeviceComponent } from './new-device/new-device.component';
import { HttpClientModule } from '@angular/common/http';
import { DeviceService } from '../../core/services/device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginator,
    MatPaginatorModule,
    MatSort,
    MatSortModule,
    MatDividerModule,
    MatButtonModule,
    MatChipsModule,
  ],
  providers: [HttpClientModule],
})
export class DeviceComponent implements OnInit {
  displayedColumns: string[] = ['type', 'description', 'status', 'options'];
  dataSource!: MatTableDataSource<any>;
  isEditing: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchDevices();
  }

  fetchDevices() {
    this.deviceService.getDevice().subscribe((devices: any) => {
      this.dataSource = new MatTableDataSource(devices);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(deviceData: any = null) {
    const dialogRef = this.dialog.open(NewDeviceComponent, {
      width: '400px',
      data: { device: deviceData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.isEditing) {
          this.putDevice(result.deviceData);
        } else {
          this.addNewDevice(result.deviceData);
        }
      }
    });
  }

  addNewDevice(formData: any) {
    this.deviceService.setDevice(formData).subscribe(
      (response: any) => {
        this.fetchDevices();
      },
      (error) => {
        console.error('Error adding new device:', error);
      }
    );
  }

  deleteDevice(device: any) {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.deleteDevice(device.id).subscribe(
        (response) => {
          this.fetchDevices();
        },
        (error) => {
          console.error('Error deleting device:', error);
        }
      );
    }
  }

  editDevice(device: any) {
    const dialogRef = this.dialog.open(NewDeviceComponent, {
      width: '400px',
      data: { device: device },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.putDevice(result);
      }
    });
  }

  putDevice(updatedDevice: any) {
    const deviceId = updatedDevice.deviceData.id;
    if (deviceId) {
      this.deviceService
        .putDevice(deviceId, updatedDevice.deviceData)
        .subscribe(
          (response: any) => {
            this.fetchDevices();
          },
          (error) => {
            console.error('Error updating device:', error);
          }
        );
    } else {
      console.error('Invalid device ID:', updatedDevice);
    }
  }
}
