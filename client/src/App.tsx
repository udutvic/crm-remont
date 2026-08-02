import {
  lazy,
  Suspense,
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

const AuditLogPage =
  lazy(
    () =>
      import(
        "features/audit/AuditLogPage"
      )
  );

const LoginPage =
  lazy(
    () =>
      import(
        "features/auth/LoginPage"
      )
  );

const ClientDetailsPage =
  lazy(
    () =>
      import(
        "features/clients/ClientDetailsPage"
      )
  );

const ClientsPage =
  lazy(
    () =>
      import(
        "features/clients/ClientsPage"
      )
  );

const DashboardPage =
  lazy(
    () =>
      import(
        "features/dashboard/DashboardPage"
      )
  );

const DeviceDetailsPage =
  lazy(
    () =>
      import(
        "features/devices/DeviceDetailsPage"
      )
  );

const DevicesPage =
  lazy(
    () =>
      import(
        "features/devices/DevicesPage"
      )
  );

const NotFoundPage =
  lazy(
    () =>
      import(
        "features/errors/NotFoundPage"
      )
  );

const InventoryPage =
  lazy(
    () =>
      import(
        "features/inventory/InventoryPage"
      )
  );

const ArchivedOrdersPage =
  lazy(
    () =>
      import(
        "features/orders/ArchivedOrdersPage"
      )
  );

const OrderDetailsPage =
  lazy(
    () =>
      import(
        "features/orders/OrderDetailsPage"
      )
  );

const OrderReceiptPage =
  lazy(
    () =>
      import(
        "features/orders/OrderReceiptPage"
      )
  );

const OrdersPage =
  lazy(
    () =>
      import(
        "features/orders/OrdersPage"
      )
  );

const StaffPage =
  lazy(
    () =>
      import(
        "features/staff/StaffPage"
      )
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

const MainApp = () => {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <RouteFallback />
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage />
            }
          />

          <Route
            path="/clients/:id"
            element={
              <ClientDetailsPage />
            }
          />

          <Route
            path="/clients"
            element={
              <ClientsPage />
            }
          />

          <Route
            path="/devices/:id"
            element={
              <DeviceDetailsPage />
            }
          />

          <Route
            path="/devices"
            element={
              <DevicesPage />
            }
          />

          <Route
            path="/orders"
            element={
              <OrdersPage />
            }
          />

          <Route
            path="/orders/archive"
            element={
              <RequireRole
                allowedRoles={[
                  "admin",
                ]}
              >
                <ArchivedOrdersPage />
              </RequireRole>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <OrderDetailsPage />
            }
          />

          <Route
            path="/inventory"
            element={
              <InventoryPage />
            }
          />

          <Route
            path="/staff"
            element={
              <RequireRole
                allowedRoles={[
                  "admin",
                ]}
              >
                <StaffPage />
              </RequireRole>
            }
          />

          <Route
            path="/audit"
            element={
              <RequireRole
                allowedRoles={[
                  "admin",
                ]}
              >
                <AuditLogPage />
              </RequireRole>
            }
          />

          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />
        </Routes>
      </Suspense>
    </MainLayout>
  );
};

function App() {
  return (
    <Suspense
      fallback={
        <RouteFallback />
      }
    >
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
}

export default App;
