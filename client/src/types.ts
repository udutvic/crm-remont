export interface Client {
  id?: number;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Device {
  id?: number;
  brand: string;
  model: string;
  serial?: string;
  clientId: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface Order {
  id?: number;
  clientId: number;
  device: Device;
  description: string;
  status: OrderStatus;
  price: number;
  date: string;
  problem: string;
  createdAt?: string;
}
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
