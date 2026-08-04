import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const getManualChunk = (
  id: string
): string | undefined => {
  const normalizedId =
    id.replace(/\\/g, "/");

  if (
    !normalizedId.includes(
      "/node_modules/"
    )
  ) {
    return undefined;
  }

  if (
    normalizedId.includes(
      "/node_modules/@mui/x-data-grid/"
    )
  ) {
    return "mui-data-grid";
  }

  if (
    normalizedId.includes(
      "/node_modules/@mui/icons-material/"
    )
  ) {
    return "mui-icons";
  }

  if (
    normalizedId.includes(
      "/node_modules/@mui/"
    ) ||
    normalizedId.includes(
      "/node_modules/@emotion/"
    )
  ) {
    return "mui";
  }

  if (
    normalizedId.includes(
      "/node_modules/react/"
    ) ||
    normalizedId.includes(
      "/node_modules/react-dom/"
    ) ||
    normalizedId.includes(
      "/node_modules/react-router/"
    ) ||
    normalizedId.includes(
      "/node_modules/scheduler/"
    )
  ) {
    return "react";
  }

  if (
    normalizedId.includes(
      "/node_modules/i18next/"
    ) ||
    normalizedId.includes(
      "/node_modules/react-i18next/"
    )
  ) {
    return "i18n";
  }

  return undefined;
};

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks:
          getManualChunk,
      },
    },
  },
});
