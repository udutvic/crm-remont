import { apiClient } from "api";
import {
  Client,
  ClientLookupResult,
  ClientPayload,
  Device,
  DevicePayload,
  Order,
  OrderPayload,
  OrderStatus,
  RepairIntakePayload,
  RepairIntakeResult,
} from "types";

export interface DashboardStats {
  clientCount: number;
  deviceCount: number;
  orderCount: number;
  totalIncome: number;
}

export interface HealthResponse {
  status: "ok" | "error";
  api: "running";
  database: "connected" | "disconnected";
  timestamp: string;
  error?: string;
}

// Health

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>("/health");

  return response.data;
};

// Clients

export const getClients = async (): Promise<Client[]> => {
  const response = await apiClient.get<Client[]>("/clients");

  return response.data;
};

export const getClient = async (id: number): Promise<Client> => {
  const response = await apiClient.get<Client>(`/clients/${id}`);

  return response.data;
};

export const lookupClientByPhone = async (
  phone: string
): Promise<ClientLookupResult> => {
  const response =
    await apiClient.get<ClientLookupResult>(
      "/clients/lookup",
      {
        params: {
          phone,
        },
      }
    );

  return response.data;
};

export const createClient = async (
  client: ClientPayload
): Promise<Client> => {
  const response = await apiClient.post<Client>(
    "/clients",
    client
  );

  return response.data;
};

export const updateClient = async (
  id: number,
  client: ClientPayload
): Promise<Client> => {
  const response = await apiClient.put<Client>(
    `/clients/${id}`,
    client
  );

  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await apiClient.delete(`/clients/${id}`);
};

export const searchClients = async (query: string): Promise<Client[]> => {
  const response = await apiClient.get<Client[]>("/clients/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};

// Devices

export const getDevices = async (): Promise<Device[]> => {
  const response = await apiClient.get<Device[]>("/devices");

  return response.data;
};

export const getDevice = async (id: number): Promise<Device> => {
  const response = await apiClient.get<Device>(`/devices/${id}`);

  return response.data;
};

export const getDevicesByClient = async (
  clientId: number
): Promise<Device[]> => {
  const response = await apiClient.get<Device[]>("/devices", {
    params: {
      clientId,
    },
  });

  return response.data;
};

export const createDevice = async (
  device: DevicePayload
): Promise<Device> => {
  const response = await apiClient.post<Device>(
    "/devices",
    device
  );

  return response.data;
};

export const updateDevice = async (
  id: number,
  device: DevicePayload
): Promise<Device> => {
  const response = await apiClient.put<Device>(
    `/devices/${id}`,
    device
  );

  return response.data;
};

export const deleteDevice = async (id: number): Promise<void> => {
  await apiClient.delete(`/devices/${id}`);
};

export const searchDevices = async (query: string): Promise<Device[]> => {
  const response = await apiClient.get<Device[]>("/devices/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};

// Orders

export const getOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>("/orders");

  return response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await apiClient.get<Order>(`/orders/${id}`);

  return response.data;
};

export const getOrdersByStatus = async (
  status: OrderStatus
): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>("/orders", {
    params: {
      status,
    },
  });

  return response.data;
};

export const getOrdersByDate = async (
  startDate: string,
  endDate: string
): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>("/orders", {
    params: {
      startDate,
      endDate,
    },
  });

  return response.data;
};

export const createOrder = async (
  order: OrderPayload
): Promise<Order> => {
  const response = await apiClient.post<Order>(
    "/orders",
    order
  );

  return response.data;
};

export const updateOrder = async (
  id: number,
  order: OrderPayload
): Promise<Order> => {
  const response = await apiClient.put<Order>(
    `/orders/${id}`,
    order
  );

  return response.data;
};

export const updateOrderStatus = async (
  id: number,
  status: OrderStatus
): Promise<Order> => {
  const response =
    await apiClient.patch<Order>(
      `/orders/${id}/status`,
      {
        status,
      }
    );

  return response.data;
};

export const markOrderDelivered = async (
  id: number
): Promise<Order> => {
  const response =
    await apiClient.patch<Order>(
      `/orders/${id}/deliver`
    );

  return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await apiClient.delete(`/orders/${id}`);
};

export const searchOrders = async (query: string): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>("/orders/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};


// Repair intake

export const createRepairIntake = async (
  intake: RepairIntakePayload
): Promise<RepairIntakeResult> => {
  const response =
    await apiClient.post<RepairIntakeResult>(
      "/intake",
      intake
    );

  return response.data;
};

// Dashboard

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>("/stats/dashboard");

  return response.data;
};