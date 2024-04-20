export interface Employee {
  id: string;
  name: string;
  email: string;
  devices: Device[];
}
export interface Device {
  id: string;
  type: string;
  description: string;
  isTaken: boolean;
}

export interface CreateEmployee {
  name: string;
  email: string;
  devices: string[];
}

export interface PutEmployee {
  name: string;
  email: string;
}

export interface PatchEmployee {
  deviceIds: string[];
}
