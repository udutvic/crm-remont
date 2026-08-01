import {
  StrictMode,
} from "react";
import {
  createRoot,
} from "react-dom/client";
import {
  BrowserRouter,
} from "react-router";

import App from "App";
import AuthProvider from "features/auth/context/AuthContext";
import "i18n";

createRoot(
  document.getElementById(
    "root"
  )!
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
