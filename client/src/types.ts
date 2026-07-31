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

export interface Device {
  id?: number;
  clientId: number;
  brand: string;
  model: string;
  serial?: string;
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