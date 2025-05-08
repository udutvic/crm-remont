import axios from 'axios';
import { Client, Device, Order, OrderStatus } from 'types';
import {API_URL} from 'api';
export const getClients = async (): Promise<Client[]> => {
  const response = await axios.get(`${API_URL}/clients`);
  return response.data;
};
export const getClient = async (id: number): Promise<Client> => {
  const response = await axios.get(`${API_URL}/clients/${id}`);
  return response.data;
};
export const createClient = async (client: Client): Promise<Client> => {
  const response = await axios.post(`${API_URL}/clients`, client);
  return response.data;
};
export const updateClient = async (id: number, client: Client): Promise<Client> => {
  const response = await axios.put(`${API_URL}/clients/${id}`, client);
  return response.data;
};
export const deleteClient = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/clients/${id}`);
};
export const getDevices = async (): Promise<Device[]> => {
  const response = await axios.get(`${API_URL}/devices`);
  return response.data;
};
export const getDevice = async (id: number): Promise<Device> => {
  const response = await axios.get(`${API_URL}/devices/${id}`);
  return response.data;
};
export const getDevicesByClient = async (clientId: number): Promise<Device[]> => {
  const response = await axios.get(`${API_URL}/devices?clientId=${clientId}`);
  return response.data;
};
export const createDevice = async (device: Device): Promise<Device> => {
  const response = await axios.post(`${API_URL}/devices`, device);
  return response.data;
};
export const updateDevice = async (id: number, device: Device): Promise<Device> => {
  const response = await axios.put(`${API_URL}/devices/${id}`, device);
  return response.data;
};
export const deleteDevice = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/devices/${id}`);
};
export const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};
export const getOrder = async (id: number): Promise<Order> => {
  const response = await axios.get(`${API_URL}/orders/${id}`);
  return response.data;
};
export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/orders?status=${status}`);
  return response.data;
};
export const createOrder = async (order: Order): Promise<Order> => {
  const response = await axios.post(`${API_URL}/orders`, order);
  return response.data;
};
export const updateOrder = async (id: number, order: Order): Promise<Order> => {
  const response = await axios.put(`${API_URL}/orders/${id}`, order);
  return response.data;
};
export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order> => {
  const response = await axios.patch(`${API_URL}/orders/${id}`, { status });
  return response.data;
};
export const deleteOrder = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/orders/${id}`);
};
export const getDashboardStats = async (): Promise<{
  clientCount: number;
  deviceCount: number;
  orderCount: number;
  totalIncome: number;
}> => {
  const response = await axios.get(`${API_URL}/stats/dashboard`);
  return response.data;
};
export const getOrdersByDate = async (startDate: string, endDate: string): Promise<Order[]> => {
  const response = await axios.get(
    `${API_URL}/orders?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
export const searchClients = async (query: string): Promise<Client[]> => {
  const response = await axios.get(`${API_URL}/clients/search?q=${query}`);
  return response.data;
};
export const searchDevices = async (query: string): Promise<Device[]> => {
  const response = await axios.get(`${API_URL}/devices/search?q=${query}`);
  return response.data;
};
export const searchOrders = async (query: string): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/orders/search?q=${query}`);
  return response.data;
};