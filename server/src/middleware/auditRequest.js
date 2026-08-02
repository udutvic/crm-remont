const {
  getRequestAuditData,
  writeAuditLog,
} = require(
  "../services/auditService"
);

const MUTATION_METHODS =
  new Set([
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ]);

const singularize = (
  value
) => {
  const singularNames = {
    clients: "client",
    devices: "device",
    intake: "intake",
    inventory: "inventory_item",
    orders: "order",
    stats: "stats",
    staff: "staff_user",
  };

  return (
    singularNames[value] ??
    value.replace(
      /s$/,
      ""
    )
  );
};

const classifyMutation = (
  req
) => {
  const path =
    String(
      req.originalUrl ??
        req.url ??
        ""
    ).split("?")[0];

  const segments =
    path
      .split("/")
      .filter(Boolean);

  const apiIndex =
    segments.indexOf(
      "api"
    );

  const collection =
    apiIndex >= 0
      ? segments[
          apiIndex + 1
        ]
      : null;

  const possibleId =
    apiIndex >= 0
      ? segments[
          apiIndex + 2
        ]
      : null;

  const suffix =
    apiIndex >= 0
      ? segments[
          apiIndex + 3
        ]
      : null;

  if (
    collection ===
      "inventory" &&
    possibleId ===
      "import" &&
    (
      suffix ===
        "preview" ||
      suffix ===
        "execute"
    )
  ) {
    return {
      action:
        "INVENTORY_IMPORT_" +
        suffix.toUpperCase(),

      entityType:
        "inventory_import",

      entityId: null,
    };
  }

  const entityType =
    collection
      ? singularize(
          collection
        )
      : null;

  const entityId =
    possibleId &&
    /^\d+$/.test(
      possibleId
    )
      ? possibleId
      : null;

  let operation;

  switch (
    req.method
  ) {
    case "POST":
      operation =
        collection ===
          "staff" &&
        suffix ===
          "revoke-sessions"
          ? "SESSIONS_REVOKE"
          : "CREATE";
      break;

    case "PUT":
      operation =
        collection ===
          "staff" &&
        suffix ===
          "password"
          ? "PASSWORD_RESET"
          : "UPDATE";
      break;

    case "PATCH":
      operation =
        suffix ===
        "status"
          ? "STATUS_UPDATE"
          : suffix ===
              "deliver"
            ? "DELIVER"
            : "UPDATE";
      break;

    case "DELETE":
      operation =
        "DELETE";
      break;

    default:
      operation =
        req.method;
  }

  return {
    action:
      `${String(
        entityType ??
          "api"
      ).toUpperCase()}_${operation}`,

    entityType,
    entityId,
  };
};

const auditProtectedMutation = (
  req,
  res,
  next
) => {
  if (
    !MUTATION_METHODS.has(
      req.method
    )
  ) {
    return next();
  }

  const classification =
    classifyMutation(req);

  res.once(
    "finish",
    () => {
      void writeAuditLog({
        userId:
          req.auth?.user
            ?.id ?? null,

        ...classification,

        method:
          req.method,

        path:
          req.originalUrl,

        statusCode:
          res.statusCode,

        ...getRequestAuditData(
          req
        ),

        metadata: {
          success:
            res.statusCode >=
              200 &&
            res.statusCode <
              400,
        },
      });
    }
  );

  return next();
};

const auditSensitiveAccess = ({
  action,
  entityType,
}) =>
  (
    req,
    res,
    next
  ) => {
    res.once(
      "finish",
      () => {
        void writeAuditLog({
          userId:
            req.auth?.user
              ?.id ?? null,

          action,
          entityType,

          entityId:
            req.params?.id ??
            null,

          method:
            req.method,

          path:
            req.originalUrl,

          statusCode:
            res.statusCode,

          ...getRequestAuditData(
            req
          ),

          metadata: {
            success:
              res.statusCode >=
                200 &&
              res.statusCode <
                400,
          },
        });
      }
    );

    return next();
  };

const auditAuthAction = (
  actionPrefix
) =>
  (
    req,
    res,
    next
  ) => {
    res.once(
      "finish",
      () => {
        const succeeded =
          res.statusCode >=
            200 &&
          res.statusCode <
            400;

        void writeAuditLog({
          userId:
            req.auth?.user
              ?.id ??
            req.auditUserId ??
            null,

          action:
            `${actionPrefix}_${
              succeeded
                ? "SUCCESS"
                : "FAILED"
            }`,

          entityType:
            "auth",

          method:
            req.method,

          path:
            req.originalUrl,

          statusCode:
            res.statusCode,

          ...getRequestAuditData(
            req
          ),

          metadata: {
            success:
              succeeded,
          },
        });
      }
    );

    return next();
  };

module.exports = {
  auditAuthAction,
  auditProtectedMutation,
  auditSensitiveAccess,
};
