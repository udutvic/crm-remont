import { apiClient } from "api";
import type {
  AuditLogListQuery,
  AuditLogListResponse,
  CreateStaffPayload,
  OrderAccessCodeResponse,
  StaffListQuery,
  StaffListResponse,
  StaffPasswordResetResponse,
  StaffSessionRevokeResponse,
  StaffUpdateResponse,
  StaffUser,
  UpdateStaffPayload,
} from "types";
import {
  AuthResponse,
  Client,
  ClientLookupResult,
  ClientPayload,
  Device,
  DevicePayload,
  LoginPayload,
  Order,
  OrderListQuery,
  OrderListResponse,
  OrderPayload,
  OrderFinanceResponse,
  OrderFinanceUpdatePayload,
  OrderStatus,
  RepairIntakePayload,
  RepairIntakeResult,
} from "types";

import type {
  InventoryImportExecuteRequest,
  InventoryImportExecuteResponse,
  InventoryImportPreviewRequest,
  InventoryImportPreviewResponse,
  InventoryItem,
  InventoryItemPayload,
  InventoryListQuery,
  InventoryListResponse,
  InventoryMovementListResponse,
  InventoryMovementPayload,
  InventoryMovementResponse,
  InventorySummary,
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

// Authentication

export const login = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response =
    await apiClient.post<AuthResponse>(
      "/auth/login",
      payload
    );

  return response.data;
};

export const logout =
  async (): Promise<void> => {
    await apiClient.post(
      "/auth/logout"
    );
  };

export const getCurrentUser =
  async (): Promise<AuthResponse> => {
    const response =
      await apiClient.get<AuthResponse>(
        "/auth/me"
      );

    return response.data;
  };

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

export const getPagedOrders = async (
  query: OrderListQuery
): Promise<OrderListResponse> => {
  const response =
    await apiClient.get<OrderListResponse>(
      "/orders/paged",
      {
        params: {
          page: query.page,
          pageSize: query.pageSize,
          sortBy: query.sortBy,
          sortDirection:
            query.sortDirection,

          ...(query.q
            ? {
                q: query.q,
              }
            : {}),

          ...(query.status &&
          query.status !== "all"
            ? {
                status:
                  query.status,
              }
            : {}),

          ...(query.delivery &&
          query.delivery !== "all"
            ? {
                delivery:
                  query.delivery,
              }
            : {}),

          ...(query.startDate
            ? {
                startDate:
                  query.startDate,
              }
            : {}),

          ...(query.endDate
            ? {
                endDate:
                  query.endDate,
              }
            : {}),
        },
      }
    );

  return response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await apiClient.get<Order>(`/orders/${id}`);

  return response.data;
};

export const getOrderFinance = async (
  id: number
): Promise<OrderFinanceResponse> => {
  const response =
    await apiClient.get<OrderFinanceResponse>(
      `/orders/${id}/finance`
    );

  return response.data;
};

export const updateOrderFinance = async (
  id: number,
  payload: OrderFinanceUpdatePayload
): Promise<OrderFinanceResponse> => {
  const response =
    await apiClient.patch<OrderFinanceResponse>(
      `/orders/${id}/finance`,
      payload
    );

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

export const revealOrderAccessCode = async (
  id: number
): Promise<OrderAccessCodeResponse> => {
  const response =
    await apiClient.get<OrderAccessCodeResponse>(
      `/orders/${id}/access-code`
    );

  return response.data;
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

// Staff management

export const getStaffUsers = async (
  query: StaffListQuery
): Promise<StaffListResponse> => {
  const response =
    await apiClient.get<StaffListResponse>(
      "/staff",
      {
        params: query,
      }
    );

  return response.data;
};

export const createStaffUser = async (
  payload: CreateStaffPayload
): Promise<StaffUser> => {
  const response =
    await apiClient.post<StaffUser>(
      "/staff",
      payload
    );

  return response.data;
};

export const updateStaffUser = async (
  id: number,
  payload: UpdateStaffPayload
): Promise<StaffUpdateResponse> => {
  const response =
    await apiClient.patch<StaffUpdateResponse>(
      `/staff/${id}`,
      payload
    );

  return response.data;
};

export const resetStaffUserPassword = async (
  id: number,
  payload: {
    password: string;
  }
): Promise<StaffPasswordResetResponse> => {
  const response =
    await apiClient.put<StaffPasswordResetResponse>(
      `/staff/${id}/password`,
      payload
    );

  return response.data;
};

export const revokeStaffUserSessions = async (
  id: number
): Promise<StaffSessionRevokeResponse> => {
  const response =
    await apiClient.post<StaffSessionRevokeResponse>(
      `/staff/${id}/revoke-sessions`
    );

  return response.data;
};

// Audit log

export const getAuditLogs = async (
  query: AuditLogListQuery
): Promise<AuditLogListResponse> => {
  const response =
    await apiClient.get<AuditLogListResponse>(
      "/audit",
      {
        params: query,
      }
    );

  return response.data;
};

// Inventory

export const getInventorySummary =
  async (): Promise<InventorySummary> => {
    const response =
      await apiClient.get<InventorySummary>(
        "/inventory/summary"
      );

    return response.data;
  };

export const getInventoryItems =
  async (
    query: InventoryListQuery
  ): Promise<InventoryListResponse> => {
    const response =
      await apiClient.get<InventoryListResponse>(
        "/inventory/items",
        {
          params: query,
        }
      );

    return response.data;
  };

export const createInventoryItem =
  async (
    payload: InventoryItemPayload
  ): Promise<InventoryItem> => {
    const response =
      await apiClient.post<InventoryItem>(
        "/inventory/items",
        payload
      );

    return response.data;
  };

export const updateInventoryItem =
  async (
    id: number,
    payload: InventoryItemPayload
  ): Promise<InventoryItem> => {
    const response =
      await apiClient.patch<InventoryItem>(
        `/inventory/items/${id}`,
        payload
      );

    return response.data;
  };

export const createInventoryMovement =
  async (
    itemId: number,
    payload: InventoryMovementPayload
  ): Promise<InventoryMovementResponse> => {
    const response =
      await apiClient.post<InventoryMovementResponse>(
        `/inventory/items/${itemId}/movements`,
        payload
      );

    return response.data;
  };

export const getInventoryMovements =
  async (
    itemId: number,
    query: {
      page: number;
      pageSize: number;
    }
  ): Promise<InventoryMovementListResponse> => {
    const response =
      await apiClient.get<InventoryMovementListResponse>(
        `/inventory/items/${itemId}/movements`,
        {
          params: query,
        }
      );

    return response.data;
  };


export const previewInventoryImport =
  async (
    payload:
      InventoryImportPreviewRequest
  ): Promise<InventoryImportPreviewResponse> => {
    const response =
      await apiClient.post<InventoryImportPreviewResponse>(
        "/inventory/import/preview",
        payload
      );

    return response.data;
  };

export const executeInventoryImport =
  async (
    payload:
      InventoryImportExecuteRequest
  ): Promise<InventoryImportExecuteResponse> => {
    const response =
      await apiClient.post<InventoryImportExecuteResponse>(
        "/inventory/import/execute",
        payload
      );

    return response.data;
  };

// Dashboard

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>("/stats/dashboard");

  return response.data;
};