const requireRole = (
  ...allowedRoles
) => {
  const allowed =
    new Set(
      allowedRoles
    );

  return (
    req,
    res,
    next
  ) => {
    const role =
      req.auth?.user
        ?.role;

    if (!role) {
      return res
        .status(401)
        .json({
          code:
            "AUTH_REQUIRED",
          error:
            "Authentication required.",
        });
    }

    if (
      !allowed.has(
        role
      )
    ) {
      return res
        .status(403)
        .json({
          code:
            "AUTH_FORBIDDEN",
          error:
            "You do not have permission to perform this action.",
        });
    }

    return next();
  };
};

module.exports =
  requireRole;
