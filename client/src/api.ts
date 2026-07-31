import axios from "axios";

const apiUrl: string | undefined = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    "VITE_API_URL is not defined. Create client/.env.local and restart Vite."
  );
}

export const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});