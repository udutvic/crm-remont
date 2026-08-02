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
  devices?: Device[];
  orders?: Order[];
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
  orders?: Order[];
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

export type UserRole =
  | "admin"
  | "technician";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface AuthErrorResponse {
  code?: string;
  error?: string;
}

export interface OrderAccessCodeResponse {
  orderId: number;
  accessType: OrderAccessType;
  accessCode: string;
}

export type AuditLogEntityFilter =
  | "all"
  | "auth"
  | "client"
  | "device"
  | "intake"
  | "order"
  | "stats"
  | "staff_user";

export interface AuditLogUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuditLog {
  id: string | number;
  userId?: number | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  method: string;
  path: string;
  statusCode: number;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<
    string,
    unknown
  > | null;
  createdAt: string;
  updatedAt: string;
  user?: AuditLogUser | null;
}

export interface AuditLogListQuery {
  page: number;
  pageSize: number;
  action?: string;
  entityType?: Exclude<
    AuditLogEntityFilter,
    "all"
  >;
  userId?: number;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogListResponse {
  items: AuditLog[];

  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type StaffRoleFilter =
  | UserRole
  | "all";

export type StaffStatusFilter =
  | "all"
  | "active"
  | "inactive";

export interface StaffUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  activeSessionCount: number;
  lastLoginAt?: string | null;
  passwordChangedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffListQuery {
  page: number;
  pageSize: number;
  q?: string;
  role?: UserRole;
  status?: StaffStatusFilter;
}

export interface StaffListResponse {
  items: StaffUser[];

  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateStaffPayload {
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  password: string;
}

export interface UpdateStaffPayload {
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface StaffUpdateResponse {
  user: StaffUser;
  revokedSessions: number;
}

export interface StaffPasswordResetResponse {
  user: StaffUser;
  revokedSessions: number;
  keptCurrentSession: boolean;
}

export interface StaffSessionRevokeResponse {
  userId: number;
  revokedSessions: number;
  keptCurrentSession: boolean;
}

export type StockMovementType =
  | "receipt"
  | "issue"
  | "return"
  | "adjustment";

export type InventoryActiveFilter =
  | "all"
  | "active"
  | "inactive";

export interface InventoryItem {
  id: number;
  sku: string;
  supplierSku?: string | null;
  barcode?: string | null;
  name: string;
  category: string;
  brand?: string | null;
  compatibility?: string | null;
  purchasePrice: number;
  salePrice: number;
  currentQuantity: number;
  minStock: number;
  supplier?: string | null;
  location?: string | null;
  note?: string | null;
  isActive: boolean;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItemPayload {
  sku: string;
  supplierSku?: string | null;
  barcode?: string | null;
  name: string;
  category: string;
  brand?: string | null;
  compatibility?: string | null;
  purchasePrice: number;
  salePrice: number;
  initialQuantity?: number;
  minStock: number;
  supplier?: string | null;
  location?: string | null;
  note?: string | null;
  isActive: boolean;
}

export interface InventorySummary {
  activeItems: number;
  totalUnits: number;
  lowStockItems: number;
  outOfStockItems: number;
  purchaseValue: number;
  saleValue: number;
}

export interface InventoryListQuery {
  page: number;
  pageSize: number;
  q?: string;
  category?: string;
  lowStock?: boolean;
  active?: boolean;
}

export interface InventoryPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface InventoryListResponse {
  items: InventoryItem[];
  pagination: InventoryPagination;
}

export interface StockMovementUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface StockMovement {
  id: number;
  inventoryItemId: number;
  type: StockMovementType;
  quantityChange: number;
  balanceBefore: number;
  balanceAfter: number;
  unitCost?: number | null;
  orderId?: number | null;
  userId: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: StockMovementUser | null;
}

export interface InventoryMovementPayload {
  type: StockMovementType;
  quantity: number;
  unitCost?: number | null;
  orderId?: number | null;
  note?: string | null;
}

export interface InventoryMovementResponse {
  item: InventoryItem;
  movement: StockMovement;
}

export interface InventoryMovementListResponse {
  movements: StockMovement[];
  pagination: InventoryPagination;
}
