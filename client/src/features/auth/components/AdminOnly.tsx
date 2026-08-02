import type {
  ReactNode,
} from "react";

import useAuth from "features/auth/context/useAuth";

interface AdminOnlyProps {
  children: ReactNode;
}

const AdminOnly = ({
  children,
}: AdminOnlyProps) => {
  const {
    user,
  } = useAuth();

  if (
    user?.role !== "admin"
  ) {
    return null;
  }

  return children;
};

export default AdminOnly;
