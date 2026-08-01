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

  deviceType: DeviceType;

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

export interface DevicePayload {
  clientId: number;
  deviceType: DeviceType;
  brand: string;
  model: string;
  imei1?: string | null;
  imei2?: string | null;
  serial?: string | null;
  color?: string | null;
}

export type OrderStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "unrepairable";

export type OrderAccessType =
  | "none"
  | "pin"
  | "password"
  | "pattern"
  | "unknown";

export interface Order {
  id?: number;

  /*
   * Temporary UI metadata used only
   * by the delete confirmation dialog.
   */
  _deleteMessage?: string;

  clientId: number;
  deviceId: number;

  problem: string;
  status: OrderStatus;

  /*
   * Temporary field used by the
   * current order form.
   */
  price: number;

  deviceCondition?: string | null;
  accessories?: string | null;

  accessType?: OrderAccessType;
  hasAccessCode?: boolean;

  diagnosis?: string | null;
  workPerformed?: string | null;
  internalNote?: string | null;

  estimatedPrice?: number | null;
  finalPrice?: number | null;

  receivedAt?: string;
  dueAt?: string | null;
  completedAt?: string | null;
  deliveredAt?: string | null;

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

  /*
   * Temporary compatibility field.
   * It will be removed after the order UI
   * fully switches to estimatedPrice.
   */
  price: number;

  deviceCondition?: string | null;
  accessories?: string | null;

  accessType?: OrderAccessType;
  accessCode?: string;

  diagnosis?: string | null;
  workPerformed?: string | null;
  internalNote?: string | null;

  estimatedPrice?: number | null;
  finalPrice?: number | null;

  receivedAt?: string;
  dueAt?: string | null;
}

export interface ExistingIntakeSelection {
  mode: "existing";
  id: number;
}

export interface NewClientIntakeSelection {
  mode: "new";
  data: ClientPayload;
}

export type IntakeClientSelection =
  | ExistingIntakeSelection
  | NewClientIntakeSelection;

export type DeviceIntakePayload =
  Omit<
    DevicePayload,
    "clientId"
  >;

export interface NewDeviceIntakeSelection {
  mode: "new";
  data: DeviceIntakePayload;
}

export type IntakeDeviceSelection =
  | ExistingIntakeSelection
  | NewDeviceIntakeSelection;

export type OrderIntakePayload =
  Omit<
    OrderPayload,
    "clientId" | "deviceId"
  >;

export interface RepairIntakePayload {
  client: IntakeClientSelection;
  device: IntakeDeviceSelection;
  order: OrderIntakePayload;
}

export interface RepairIntakeResult {
  client: Client;
  device: Device;
  order: Order;

  created: {
    client: boolean;
    device: boolean;
  };
}

export interface RepairIntakeErrorMeta {
  existingClientId?: number;
  existingDeviceId?: number;
  identifier?: string;
}

export interface RepairIntakeErrorResponse {
  code?: string;
  error?: string;

  details?: Record<
    string,
    string
  >;

  meta?: RepairIntakeErrorMeta;
}


export type OrderListDeliveryFilter =
  | "all"
  | "delivered"
  | "not_delivered"
  | "ready";

export type OrderListSortField =
  | "id"
  | "receivedAt"
  | "dueAt"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "estimatedPrice"
  | "finalPrice";

export type OrderListSortDirection =
  | "asc"
  | "desc";

export interface OrderListQuery {
  q?: string;

  status?:
    | OrderStatus
    | "all";

  delivery?:
    OrderListDeliveryFilter;

  startDate?: string;
  endDate?: string;

  page: number;
  pageSize: number;

  sortBy:
    OrderListSortField;

  sortDirection:
    OrderListSortDirection;
}

export interface OrderListPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface OrderListResponse {
  items: Order[];

  pagination:
    OrderListPagination;

  sort: {
    field:
      OrderListSortField;

    direction:
      OrderListSortDirection;
  };
}
