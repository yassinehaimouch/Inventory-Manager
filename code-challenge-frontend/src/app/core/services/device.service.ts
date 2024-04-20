import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '../interfaces/empleyee.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private _http: HttpClient) {}

  api_url: string = 'https://localhost:5071';

  getDevice(): Observable<Device> {
    return this._http.get<Device>(`${this.api_url}/api/Devices`);
  }

  setDevice(data: any): Observable<Device> {
    return this._http.put<Device>(`${this.api_url}/api/Devices`, data);
  }

  deleteDevice(id: any): Observable<any> {
    return this._http.delete<Device>(`${this.api_url}/api/Devices/${id}`);
  }

  putDevice(id: any, updatedDevice: any): Observable<any> {
    return this._http.patch(`${this.api_url}/api/Devices/${id}`, updatedDevice);
  }
}
