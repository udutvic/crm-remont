const {
  Op,
} = require(
  "sequelize"
);

const AuditLog = require(
  "../models/AuditLog"
);

const User = require(
  "../models/User"
);

const parsePositiveInteger = (
  value,
  fallback,
  maximum
) => {
  const parsed =
    Number(value);

  if (
    !Number.isInteger(
      parsed
    ) ||
    parsed < 1
  ) {
    return fallback;
  }

  return Math.min(
    parsed,
    maximum
  );
};

const parseDate = (
  value,
  endOfDay = false
) => {
  const raw =
    String(value ?? "")
      .trim();

  if (!raw) {
    return null;
  }

  const dateOnly =
    /^\d{4}-\d{2}-\d{2}$/.test(
      raw
    );

  const date =
    dateOnly
      ? new Date(
          `${raw}T${
            endOfDay
              ? "23:59:59.999"
              : "00:00:00.000"
          }Z`
        )
      : new Date(raw);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
};

exports.getAuditLogs =
  async (
    req,
    res,
    next
  ) => {
    const page =
      parsePositiveInteger(
        req.query.page,
        1,
        1_000_000
      );

    const pageSize =
      parsePositiveInteger(
        req.query.pageSize,
        25,
        100
      );

    const where = {};

    const action =
      String(
        req.query.action ??
          ""
      )
        .trim()
        .toUpperCase();

    if (action) {
      where.action = {
        [Op.iLike]:
          `%${action}%`,
      };
    }

    const entityType =
      String(
        req.query
          .entityType ?? ""
      )
        .trim()
        .toLowerCase();

    if (entityType) {
      where.entityType =
        entityType;
    }

    const userId =
      Number(
        req.query.userId
      );

    if (
      req.query.userId !==
        undefined &&
      (
        !Number.isInteger(
          userId
        ) ||
        userId < 1
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid user ID.",
        });
    }

    if (
      Number.isInteger(
        userId
      ) &&
      userId > 0
    ) {
      where.userId =
        userId;
    }

    const startDate =
      parseDate(
        req.query.startDate
      );

    const endDate =
      parseDate(
        req.query.endDate,
        true
      );

    if (
      req.query.startDate &&
      !startDate
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid start date.",
        });
    }

    if (
      req.query.endDate &&
      !endDate
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid end date.",
        });
    }

    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      return res
        .status(400)
        .json({
          error:
            "Start date cannot be later than end date.",
        });
    }

    if (
      startDate ||
      endDate
    ) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt[
          Op.gte
        ] = startDate;
      }

      if (endDate) {
        where.createdAt[
          Op.lte
        ] = endDate;
      }
    }

    try {
      const {
        count,
        rows,
      } =
        await AuditLog.findAndCountAll(
          {
            where,

            include: [
              {
                model:
                  User,
                as: "user",

                attributes: [
                  "id",
                  "email",
                  "name",
                  "role",
                ],

                required:
                  false,
              },
            ],

            order: [
              [
                "createdAt",
                "DESC",
              ],
              [
                "id",
                "DESC",
              ],
            ],

            limit:
              pageSize,

            offset:
              (page - 1) *
              pageSize,

            distinct:
              true,
          }
        );

      return res
        .status(200)
        .json({
          items:
            rows.map(
              (
                auditLog
              ) =>
                auditLog.get({
                  plain:
                    true,
                })
            ),

          pagination: {
            page,
            pageSize,
            total: count,

            totalPages:
              Math.max(
                1,
                Math.ceil(
                  count /
                    pageSize
                )
              ),
          },
        });
    } catch (error) {
      return next(
        error
      );
    }
  };
