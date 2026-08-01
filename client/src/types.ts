export interface Client {
  id?: number;
  name: string;
  phone: string;
  phoneNormalized?: string;
  secondaryPhone?: string | null;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientPayload {
  name: string;
  phone: string;
  secondaryPhone?: string | null;
  email?: string | null;
  address?: string | null;
  note?: string | null;
}

export interface ClientLookupResult {
  found: boolean;
  client: Client | null;
}

export type DeviceType =
  | "phone"
  | "tablet"
  | "laptop"
  | "smartwatch"
  | "other";

export interface Device {
  id?: number;
  clientId: number;

  deviceType?: DeviceType;

  brand: string;
  model: string;

  imei1?: string | null;
  imei1Normalized?: string | null;

  imei2?: string | null;
  imei2Normalized?: string | null;

  serial?: string | null;
  serialNormalized?: string | null;

  color?: string | null;

  client?: Client;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Order {
  id?: number;
  clientId: number;
  deviceId: number;
  problem: string;
  status: OrderStatus;
  price: number;
  client?: Client;
  device: Device;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderPayload {
  clientId: number;
  deviceId: number;
  problem: string;
  status: OrderStatus;
  price: number;
}