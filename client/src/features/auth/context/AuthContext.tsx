import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  ReactNode,
} from "react";
import type {
  AxiosError,
} from "axios";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "index";
import type {
  AuthErrorResponse,
  AuthUser,
  LoginPayload,
} from "types";

import AuthContext from "./authContextValue";
import type {
  AuthContextValue,
} from "./authContextValue";

interface AuthProviderProps {
  children: ReactNode;
}

const isUnauthorized = (
  error: unknown
): boolean => {
  const axiosError =
    error as AxiosError<AuthErrorResponse>;

  return (
    axiosError.response
      ?.status === 401
  );
};

const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [
    user,
    setUser,
  ] = useState<AuthUser | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    sessionError,
    setSessionError,
  ] = useState(false);

  const refreshSession =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(true);
          setSessionError(false);

          const response =
            await getCurrentUser();

          setUser(
            response.user
          );
        } catch (
          error: unknown
        ) {
          setUser(null);

          if (
            !isUnauthorized(
              error
            )
          ) {
            console.error(
              "Session check failed:",
              error
            );

            setSessionError(
              true
            );
          }
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const handleUnauthorized =
      (): void => {
        setUser(null);
        setSessionError(false);
      };

    window.addEventListener(
      "crm-remont:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "crm-remont:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  const login =
    useCallback(
      async (
        payload: LoginPayload
      ): Promise<AuthUser> => {
        const response =
          await loginRequest(
            payload
          );

        setUser(
          response.user
        );

        setSessionError(false);

        return response.user;
      },
      []
    );

  const logout =
    useCallback(
      async (): Promise<void> => {
        try {
          await logoutRequest();
        } finally {
          setUser(null);
          setSessionError(false);
        }
      },
      []
    );

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        loading,
        sessionError,
        login,
        logout,
        refreshSession,
      }),
      [
        user,
        loading,
        sessionError,
        login,
        logout,
        refreshSession,
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
