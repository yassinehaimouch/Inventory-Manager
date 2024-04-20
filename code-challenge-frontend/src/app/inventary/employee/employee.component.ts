import { Component, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { EmployeeService } from '../../core/services/employee.service';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { Employee } from '../../core/interfaces/empleyee.interface';
import { DetailsComponent } from './details/details.component';
import { DeviceService } from '../../core/services/device.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-employee',
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
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  displayedColumns: string[] = ['name', 'email', 'devices', 'options'];
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  listEmployee: Employee[] = [];
  editListEmployee: Employee[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    public deviceService: DeviceService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>([]);
    this.getEmployeeData();
  }

  getEmployeeData() {
    this.employeeService.getEmployee().subscribe((resp) => {
      this.addEmployeeData(resp);
    });
  }

  addEmployeeData(data: any) {
    this.listEmployee = data;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getDevices(devices: any[]) {
    return devices.map((device: any) => device.description).join(', ');
  }

  refreshData(): void {
    this.getEmployeeData();
  }

  addEmployee(data: any, da: any): void {
    console.log(data);

    this.employeeService.setEmployee(data).subscribe(
      (resp: any) => {
        console.log('resp', resp);
        this.employeeService.putEmployeeDevices(resp, da).subscribe(() => {
          this.getEmployeeData();
        });
        this.refreshData();
      },
      (error: any) => {
        console.error('Error addEmployee', error);
      }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteEmployee(index: any) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(index.id).subscribe((resp: any) => {
        const elementIndex = this.listEmployee.findIndex(
          (employee) => employee.id === index.id
        );
        if (elementIndex !== -1) {
          this.listEmployee.splice(elementIndex, 1);
          this.addEmployeeData(this.listEmployee);
        }
      });
    }
  }

  editEmployee(employee: any) {
    sessionStorage.setItem('mode', 'edit');
    let employeeList = sessionStorage.getItem('employeeList');

    try {
      JSON.parse(employeeList as string).forEach((element: any) => {
        if (element.id === employee.id) {
          this.editListEmployee = element;
        }
      });
    } catch (error) {}
    sessionStorage.setItem(
      'editEmployee',
      JSON.stringify(this.editListEmployee)
    );
  }

  openEmployeeDialog(employee: Employee) {
    var modal = this.dialog.open(NewEmployeeComponent, {
      width: '30%',
      height: 'auto',
      enterAnimationDuration: '400ms',
      data: employee,
    });

    modal.afterClosed().subscribe((createEmployeeData) => {
      if (createEmployeeData?.mode === 'update') {
        console.log('createEmployeeData', createEmployeeData);
        const devicesUpdate$ = this.employeeService.putEmployeeDevices(
          employee.id,
          createEmployeeData.devices
        );

        const dataUpdate$ = this.employeeService.putEmployee(employee.id, {
          name: createEmployeeData.name,
          email: createEmployeeData.email,
        });

        forkJoin({ devicesUpdate$, dataUpdate$ }).subscribe(() => {
          this.getEmployeeData();
        });
      } else {
        const newEmployee = {
          name: createEmployeeData?.name,
          email: createEmployeeData?.email,
        };
        this.addEmployee(newEmployee, createEmployeeData?.devices);
      }

      this.getEmployeeData();
    });
  }

  dialogDetail(devices: any) {
    this.dialog.open(DetailsComponent, {
      width: '20%',
      height: 'auto',
      enterAnimationDuration: '400ms',
      data: devices,
    });
  }
}
