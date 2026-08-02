import {
  Route,
  Routes,
} from "react-router";

import MainLayout from "components/layout/MainLayout";
import AuditLogPage from "features/audit/AuditLogPage";
import PublicOnlyRoute from "features/auth/components/PublicOnlyRoute";
import RequireAuth from "features/auth/components/RequireAuth";
import RequireRole from "features/auth/components/RequireRole";
import LoginPage from "features/auth/LoginPage";
import ClientDetailsPage from "features/clients/ClientDetailsPage";
import ClientsPage from "features/clients/ClientsPage";
import DashboardPage from "features/dashboard/DashboardPage";
import NotFoundPage from "features/errors/NotFoundPage";
import DeviceDetailsPage from "features/devices/DeviceDetailsPage";
import DevicesPage from "features/devices/DevicesPage";
import OrderDetailsPage from "features/orders/OrderDetailsPage";
import OrderReceiptPage from "features/orders/OrderReceiptPage";
import OrdersPage from "features/orders/OrdersPage";
import StaffPage from "features/staff/StaffPage";

const MainApp = () => {
  return (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage />
          }
        />

        <Route
          path="/clients/:id"
          element={<ClientDetailsPage />}
        />

        <Route
          path="/clients"
          element={
            <ClientsPage />
          }
        />

        <Route
          path="/devices/:id"
          element={<DeviceDetailsPage />}
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
          path="/orders/:id"
          element={
            <OrderDetailsPage />
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
    </MainLayout>
  );
};

function App() {
  return (
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
  );
}

export default App;
