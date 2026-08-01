import MainLayout from "components/layout/MainLayout";
import DashboardPage from "features/dashboard/DashboardPage";
import ClientsPage from "features/clients/ClientsPage";
import DevicesPage from "features/devices/DevicesPage";
import OrdersPage from "features/orders/OrdersPage";
import OrderDetailsPage from "features/orders/OrderDetailsPage";
import { Routes, Route } from "react-router";
function App() {
  return (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={<DashboardPage />}
        />
        <Route
          path="/clients"
          element={<ClientsPage />}
        />
        <Route
          path="/devices"
          element={<DevicesPage />}
        />
        <Route
          path="/orders"
          element={<OrdersPage />}
        />
        <Route
          path="/orders/:id"
          element={<OrderDetailsPage />}
        />
      </Routes>
    </MainLayout>
  );
}
export default App;
