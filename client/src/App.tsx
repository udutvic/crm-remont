import {
  Route,
  Routes,
} from "react-router";

import MainLayout from "components/layout/MainLayout";
import ClientsPage from "features/clients/ClientsPage";
import DashboardPage from "features/dashboard/DashboardPage";
import DevicesPage from "features/devices/DevicesPage";
import OrderDetailsPage from "features/orders/OrderDetailsPage";
import OrderReceiptPage from "features/orders/OrderReceiptPage";
import OrdersPage from "features/orders/OrdersPage";

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
          path="/clients"
          element={
            <ClientsPage />
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
          path="/orders/:id"
          element={
            <OrderDetailsPage />
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
        path="/orders/:id/receipt"
        element={
          <OrderReceiptPage />
        }
      />

      <Route
        path="*"
        element={
          <MainApp />
        }
      />
    </Routes>
  );
}

export default App;
