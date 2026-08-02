import type {
  ReactNode,
} from "react";
import {
  Navigate,
} from "react-router";

import LoadingIndicator from "components/ui/LoadingIndicator";
import useAuth from "features/auth/context/useAuth";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

const PublicOnlyRoute = ({
  children,
}: PublicOnlyRouteProps) => {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

export default PublicOnlyRoute;
