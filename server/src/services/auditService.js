const AuditLog = require(
  "../models/AuditLog"
);

const normalizeOptionalText = (
  value,
  maxLength
) => {
  const normalized =
    String(value ?? "")
      .trim()
      .slice(
        0,
        maxLength
      );

  return normalized || null;
};

const writeAuditLog =
  async ({
    userId = null,
    action,
    entityType = null,
    entityId = null,
    method,
    path,
    statusCode,
    ipAddress = null,
    userAgent = null,
    metadata = null,
  }) => {
    try {
      await AuditLog.create({
        userId:
          Number.isInteger(
            Number(userId)
          )
            ? Number(userId)
            : null,

        action:
          String(action)
            .trim()
            .slice(
              0,
              100
            ),

        entityType:
          normalizeOptionalText(
            entityType,
            64
          ),

        entityId:
          normalizeOptionalText(
            entityId,
            64
          ),

        method:
          String(
            method ?? "GET"
          )
            .trim()
            .toUpperCase()
            .slice(
              0,
              10
            ),

        path:
          String(
            path ?? "/"
          )
            .split("?")[0]
            .slice(
              0,
              500
            ),

        statusCode:
          Number.isInteger(
            Number(
              statusCode
            )
          )
            ? Number(
                statusCode
              )
            : 500,

        ipAddress:
          normalizeOptionalText(
            ipAddress,
            64
          ),

        userAgent:
          normalizeOptionalText(
            userAgent,
            512
          ),

        metadata:
          metadata &&
          typeof metadata ===
            "object"
            ? metadata
            : null,
      });
    } catch (error) {
      /*
       * Audit persistence must never
       * break the business request.
       */
      console.error(
        "Failed to write audit log:",
        error
      );
    }
  };

const getRequestAuditData = (
  req
) => ({
  ipAddress:
    String(
      req.ip ?? ""
    ).slice(0, 64) ||
    null,

  userAgent:
    String(
      req.get(
        "user-agent"
      ) ?? ""
    ).slice(0, 512) ||
    null,
});

module.exports = {
  getRequestAuditData,
  writeAuditLog,
};
