import axios from "axios";

const apiUrl:
  | string
  | undefined =
  import.meta.env
    .VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    "VITE_API_URL is not defined. Create client/.env.local and restart Vite."
  );
}

export const apiClient =
  axios.create({
    baseURL: apiUrl,
    timeout: 10_000,
    withCredentials: true,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

apiClient.interceptors.response.use(
  (response) =>
    response,

  (
    error: unknown
  ) => {
    if (
      axios.isAxiosError(
        error
      ) &&
      error.response
        ?.status === 401
    ) {
      const requestUrl =
        String(
          error.config
            ?.url ?? ""
        );

      const isAuthCheck =
        requestUrl.includes(
          "/auth/me"
        );

      const isLogin =
        requestUrl.includes(
          "/auth/login"
        );

      if (
        !isAuthCheck &&
        !isLogin
      ) {
        window.dispatchEvent(
          new Event(
            "crm-remont:unauthorized"
          )
        );
      }
    }

    return Promise.reject(
      error
    );
  }
);
