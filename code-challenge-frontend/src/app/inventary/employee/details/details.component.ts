import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DeviceService } from '../../../core/services/device.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  displayedColumns: any[];
  dataSource: any[] = [];
  devices: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public deviceService: DeviceService,
    private ref: MatDialogRef<DetailsComponent>
  ) {
    this.displayedColumns = ['type', 'description'];
  }

  ngOnInit(): void {
    this.devices = this.data.devices;
    this.dataSource = this.data;
  }
  saveDialog() {
    this.ref.close();
  }
}
