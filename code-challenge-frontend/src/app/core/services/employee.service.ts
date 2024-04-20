import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateEmployee,
  Employee,
  PutEmployee,
  PatchEmployee,
} from '../interfaces/empleyee.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private _http: HttpClient) {}

  api_url: string = 'https://localhost:5071';

  getEmployee(): Observable<Employee> {
    return this._http.get<Employee>(`${this.api_url}/api/Employees`);
  }

  setEmployee(data: any): Observable<CreateEmployee> {
    return this._http.put<CreateEmployee>(
      `${this.api_url}/api/Employees`,
      data
    );
  }

  deleteEmployee(id: any): Observable<any> {
    return this._http.delete(`${this.api_url}/api/Employees/${id}`);
  }

  putEmployee(
    employeeId: string,
    data: { name: string; email: string }
  ): Observable<PutEmployee> {
    return this._http.patch<PutEmployee>(
      `${this.api_url}/api/Employees/${employeeId}`,
      data
    );
  }

  putEmployeeDevices(
    employeeId: string,
    deviceIds: string[]
  ): Observable<PatchEmployee> {
    return this._http.patch<PatchEmployee>(
      `${this.api_url}/api/Employees/devices/${employeeId}`,
      {
        deviceIds,
      }
    );
  }
}
