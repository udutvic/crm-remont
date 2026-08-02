import {
  createContext,
} from "react";

import type {
  AuthUser,
  LoginPayload,
} from "types";

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  sessionError: boolean;

  login: (
    payload: LoginPayload
  ) => Promise<AuthUser>;

  logout: () => Promise<void>;

  refreshSession:
    () => Promise<void>;
}

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

export default AuthContext;
