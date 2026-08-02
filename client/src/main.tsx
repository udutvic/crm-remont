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
import {
  initializeI18n,
} from "i18n";

const rootElement =
  document.getElementById(
    "root"
  );

if (!rootElement) {
  throw new Error(
    "Application root element was not found."
  );
}

const bootstrap =
  async (): Promise<void> => {
    await initializeI18n();

    createRoot(
      rootElement
    ).render(
      <StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </StrictMode>
    );
  };

void bootstrap().catch(
  (
    error: unknown
  ) => {
    console.error(
      "Failed to start the application:",
      error
    );
  }
);
