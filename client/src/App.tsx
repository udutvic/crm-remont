import {
  lazy,
  Suspense,
  type ReactNode,
} from "react";
import {
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Route,
  Routes,
} from "react-router";

import MainLayout from "components/layout/MainLayout";
import PublicOnlyRoute from "features/auth/components/PublicOnlyRoute";
import RequireAuth from "features/auth/components/RequireAuth";
import RequireRole from "features/auth/components/RequireRole";

const AuditLogPage = lazy(() => import("features/audit/AuditLogPage"));
const LoginPage = lazy(() => import("features/auth/LoginPage"));
const ClientDetailsPage = lazy(
  () => import("features/clients/ClientDetailsPage")
);
const ClientsPage = lazy(() => import("features/clients/ClientsPage"));
const DashboardPage = lazy(
  () => import("features/dashboard/DashboardPage")
);
const DeviceDetailsPage = lazy(
  () => import("features/devices/DeviceDetailsPage")
);
const DevicesPage = lazy(() => import("features/devices/DevicesPage"));
const NotFoundPage = lazy(() => import("features/errors/NotFoundPage"));
const InventoryPage = lazy(
  () => import("features/inventory/InventoryPage")
);
const ArchivedOrdersPage = lazy(
  () => import("features/orders/ArchivedOrdersPage")
);
const OrderDetailsPage = lazy(
  () => import("features/orders/OrderDetailsPage")
);
const OrderReceiptPage = lazy(
  () => import("features/orders/OrderReceiptPage")
);
const OrdersPage = lazy(() => import("features/orders/OrdersPage"));
const RepairIntakeWizardPage = lazy(
  () => import("features/orders/intake/RepairIntakeWizardPageV2")
);
const StaffPage = lazy(() => import("features/staff/StaffPage"));

interface AdminOnlyProps {
  children: ReactNode;
}

const AdminOnly = ({ children }: AdminOnlyProps) => (
  <RequireRole allowedRoles={["admin"]}>{children}</RequireRole>
);

const RouteFallback = () => (
  <Box
    role="status"
    aria-label="Loading page"
    sx={{
      minHeight: 280,
      display: "grid",
      placeItems: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

const MainApp = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/clients/:id" element={<ClientDetailsPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/devices/:id" element={<DeviceDetailsPage />} />
      <Route path="/devices" element={<DevicesPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route
        path="/orders/new-v2"
        element={<RepairIntakeWizardPage />}
      />
      <Route
        path="/orders/archive"
        element={
          <AdminOnly>
            <ArchivedOrdersPage />
          </AdminOnly>
        }
      />
      <Route path="/orders/:id" element={<OrderDetailsPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route
        path="/staff"
        element={
          <AdminOnly>
            <StaffPage />
          </AdminOnly>
        }
      />
      <Route
        path="/audit"
        element={
          <AdminOnly>
            <AuditLogPage />
          </AdminOnly>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </MainLayout>
);

const App = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/orders/:id/receipt"
        element={
          <RequireAuth>
            <OrderReceiptPage />
          </RequireAuth>
        }
      />
      <Route
        path="*"
        element={
          <RequireAuth>
            <MainApp />
          </RequireAuth>
        }
      />
    </Routes>
  </Suspense>
);

export default App;
