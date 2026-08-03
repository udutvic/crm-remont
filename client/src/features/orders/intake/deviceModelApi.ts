import { apiClient } from "api";
import type {
  DeviceType,
} from "types";

export interface DeviceModelCatalogItem {
  id: number;
  deviceType: DeviceType;
  brand: string;
  model: string;
  aliases: string[];
  usageCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDeviceModelPayload {
  deviceType: DeviceType;
  brand: string;
  model: string;
  aliases?: string[];
}

export const getDeviceModels = async (
  query = "",
  limit = 20
): Promise<DeviceModelCatalogItem[]> => {
  const response =
    await apiClient.get<
      DeviceModelCatalogItem[]
    >(
      "/device-models",
      {
        params: {
          ...(query.trim()
            ? { q: query.trim() }
            : {}),
          limit,
        },
      }
    );

  return response.data;
};

export const createDeviceModel = async (
  payload: CreateDeviceModelPayload
): Promise<DeviceModelCatalogItem> => {
  const response =
    await apiClient.post<
      DeviceModelCatalogItem
    >(
      "/device-models",
      payload
    );

  return response.data;
};
