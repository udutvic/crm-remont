const {
  Op,
  col,
  fn,
} = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const AuthSession = require(
  "../models/AuthSession"
);

const User = require(
  "../models/User"
);

const {
  hashPassword,
  validatePassword,
} = require(
  "../utils/passwordHash"
);

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parsePositiveInteger = (
  value,
  fallback = null,
  maximum = null
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

  return maximum
    ? Math.min(
        parsed,
        maximum
      )
    : parsed;
};

const normalizeEmail = (
  value
) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizeName = (
  value
) =>
  String(value ?? "")
    .trim();

const normalizeRole = (
  value
) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const validateEmail = (
  value
) => {
  const email =
    normalizeEmail(value);

  if (!email) {
    return {
      value: email,
      error:
        "Email is required.",
    };
  }

  if (
    email.length > 254 ||
    !EMAIL_PATTERN.test(
      email
    )
  ) {
    return {
      value: email,
      error:
        "Enter a valid email address.",
    };
  }

  return {
    value: email,
    error: null,
  };
};

const validateName = (
  value
) => {
  const name =
    normalizeName(value);

  if (
    name.length < 2 ||
    name.length > 120
  ) {
    return {
      value: name,
      error:
        "Name must contain between 2 and 120 characters.",
    };
  }

  return {
    value: name,
    error: null,
  };
};

const validateRole = (
  value
) => {
  const role =
    normalizeRole(value);

  if (
    !User.USER_ROLES.includes(
      role
    )
  ) {
    return {
      value: role,
      error:
        "Role must be admin or technician.",
    };
  }

  return {
    value: role,
    error: null,
  };
};

const validateBoolean = (
  value,
  fieldName
) => {
  if (
    typeof value !==
    "boolean"
  ) {
    return {
      value,
      error:
        `${fieldName} must be a boolean.`,
    };
  }

  return {
    value,
    error: null,
  };
};

const sendValidationError = (
  res,
  details
) =>
  res.status(400).json({
    code:
      "STAFF_VALIDATION_FAILED",
    error:
      "Staff validation failed.",
    details,
  });

const handleStaffError = (
  res,
  error,
  operation
) => {
  if (
    error.name ===
    "SequelizeUniqueConstraintError"
  ) {
    return res.status(409).json({
      code:
        "STAFF_EMAIL_EXISTS",
      error:
        "A staff account with this email already exists.",
    });
  }

  if (
    error.name ===
    "SequelizeValidationError"
  ) {
    const details =
      error.errors.reduce(
        (
          result,
          item
        ) => {
          result[
            item.path ??
              "staff"
          ] =
            item.message;

          return result;
        },
        {}
      );

    return sendValidationError(
      res,
      details
    );
  }

  console.error(
    `Staff ${operation} failed:`,
    error
  );

  return res.status(500).json({
    code:
      "STAFF_INTERNAL_ERROR",
    error:
      "Internal server error.",
  });
};

const countActiveSessions =
  async (
    userIds,
    transaction = null
  ) => {
    if (
      userIds.length === 0
    ) {
      return new Map();
    }

    const rows =
      await AuthSession.findAll({
        attributes: [
          "userId",
          [
            fn(
              "COUNT",
              col("id")
            ),
            "count",
          ],
        ],

        where: {
          userId: {
            [Op.in]:
              userIds,
          },

          revokedAt: {
            [Op.is]: null,
          },

          expiresAt: {
            [Op.gt]:
              new Date(),
          },
        },

        group: [
          "userId",
        ],

        raw: true,
        transaction,
      });

    return new Map(
      rows.map(
        (row) => [
          Number(
            row.userId
          ),
          Number(
            row.count
          ),
        ]
      )
    );
  };

const serializeStaffUser = (
  user,
  activeSessionCount = 0
) => {
  const plain =
    typeof user.get ===
    "function"
      ? user.get({
          plain: true,
        })
      : {
          ...user,
        };

  delete plain.passwordHash;

  return {
    id: plain.id,
    email: plain.email,
    name: plain.name,
    role: plain.role,

    isActive:
      Boolean(
        plain.isActive
      ),

    activeSessionCount:
      Number(
        activeSessionCount
      ) || 0,

    lastLoginAt:
      plain.lastLoginAt ??
      null,

    passwordChangedAt:
      plain.passwordChangedAt,

    createdAt:
      plain.createdAt,

    updatedAt:
      plain.updatedAt,
  };
};

const findUserById = (
  id,
  options = {}
) =>
  User.unscoped().findByPk(
    id,
    options
  );

const ensureEmailAvailable =
  async (
    email,
    excludeId = null,
    transaction = null
  ) => {
    const where = {
      email,
    };

    if (excludeId) {
      where.id = {
        [Op.ne]:
          excludeId,
      };
    }

    return User.unscoped().findOne({
      where,
      attributes: [
        "id",
      ],
      transaction,
    });
  };

const ensureAdminSafety =
  async ({
    actorUserId,
    targetUser,
    nextRole,
    nextIsActive,
    transaction = null,
  }) => {
    if (
      targetUser.id ===
      actorUserId
    ) {
      if (!nextIsActive) {
        return {
          status: 409,
          code:
            "STAFF_SELF_DEACTIVATE_FORBIDDEN",
          error:
            "You cannot deactivate your own account.",
        };
      }

      if (
        nextRole !==
        "admin"
      ) {
        return {
          status: 409,
          code:
            "STAFF_SELF_DEMOTE_FORBIDDEN",
          error:
            "You cannot remove your own administrator role.",
        };
      }
    }

    const removesActiveAdmin =
      targetUser.role ===
        "admin" &&
      targetUser.isActive &&
      (
        nextRole !==
          "admin" ||
        !nextIsActive
      );

    if (
      !removesActiveAdmin
    ) {
      return null;
    }

    const remainingActiveAdmins =
      await User.count({
        where: {
          id: {
            [Op.ne]:
              targetUser.id,
          },
          role: "admin",
          isActive: true,
        },
        transaction,
      });

    if (
      remainingActiveAdmins ===
      0
    ) {
      return {
        status: 409,
        code:
          "STAFF_LAST_ADMIN_REQUIRED",
        error:
          "At least one active administrator must remain.",
      };
    }

    return null;
  };

exports.getStaffUsers =
  async (
    req,
    res
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

    const query =
      String(
        req.query.q ?? ""
      ).trim();

    if (query) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]:
              `%${query}%`,
          },
        },
        {
          email: {
            [Op.iLike]:
              `%${query}%`,
          },
        },
      ];
    }

    const role =
      String(
        req.query.role ?? ""
      )
        .trim()
        .toLowerCase();

    if (
      role &&
      role !== "all"
    ) {
      if (
        !User.USER_ROLES.includes(
          role
        )
      ) {
        return res
          .status(400)
          .json({
            code:
              "STAFF_INVALID_ROLE_FILTER",
            error:
              "Invalid role filter.",
          });
      }

      where.role = role;
    }

    const status =
      String(
        req.query.status ??
          "all"
      )
        .trim()
        .toLowerCase();

    if (
      ![
        "all",
        "active",
        "inactive",
      ].includes(
        status
      )
    ) {
      return res
        .status(400)
        .json({
          code:
            "STAFF_INVALID_STATUS_FILTER",
          error:
            "Invalid status filter.",
        });
    }

    if (
      status ===
      "active"
    ) {
      where.isActive =
        true;
    }

    if (
      status ===
      "inactive"
    ) {
      where.isActive =
        false;
    }

    try {
      const {
        count,
        rows,
      } =
        await User.findAndCountAll({
          where,

          attributes: [
            "id",
            "email",
            "name",
            "role",
            "isActive",
            "lastLoginAt",
            "passwordChangedAt",
            "createdAt",
            "updatedAt",
          ],

          order: [
            [
              "name",
              "ASC",
            ],
            [
              "id",
              "ASC",
            ],
          ],

          limit:
            pageSize,

          offset:
            (page - 1) *
            pageSize,
        });

      const sessionCounts =
        await countActiveSessions(
          rows.map(
            (user) =>
              user.id
          )
        );

      return res
        .status(200)
        .json({
          items:
            rows.map(
              (user) =>
                serializeStaffUser(
                  user,
                  sessionCounts.get(
                    user.id
                  ) ?? 0
                )
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
      return handleStaffError(
        res,
        error,
        "list"
      );
    }
  };

exports.createStaffUser =
  async (
    req,
    res
  ) => {
    const emailResult =
      validateEmail(
        req.body?.email
      );

    const nameResult =
      validateName(
        req.body?.name
      );

    const roleResult =
      validateRole(
        req.body?.role ??
          "technician"
      );

    const errors = {};

    if (
      emailResult.error
    ) {
      errors.email =
        emailResult.error;
    }

    if (
      nameResult.error
    ) {
      errors.name =
        nameResult.error;
    }

    if (
      roleResult.error
    ) {
      errors.role =
        roleResult.error;
    }

    const password =
      req.body?.password;

    try {
      validatePassword(
        password
      );
    } catch (error) {
      errors.password =
        error.message;
    }

    let isActive =
      true;

    if (
      req.body?.isActive !==
      undefined
    ) {
      const activeResult =
        validateBoolean(
          req.body.isActive,
          "isActive"
        );

      if (
        activeResult.error
      ) {
        errors.isActive =
          activeResult.error;
      } else {
        isActive =
          activeResult.value;
      }
    }

    if (
      Object.keys(
        errors
      ).length > 0
    ) {
      return sendValidationError(
        res,
        errors
      );
    }

    try {
      const existing =
        await ensureEmailAvailable(
          emailResult.value
        );

      if (existing) {
        return res
          .status(409)
          .json({
            code:
              "STAFF_EMAIL_EXISTS",
            error:
              "A staff account with this email already exists.",
          });
      }

      const passwordHash =
        await hashPassword(
          password
        );

      const user =
        await User.create({
          email:
            emailResult.value,

          name:
            nameResult.value,

          role:
            roleResult.value,

          isActive,
          passwordHash,

          passwordChangedAt:
            new Date(),
        });

      return res
        .status(201)
        .json(
          serializeStaffUser(
            user,
            0
          )
        );
    } catch (error) {
      return handleStaffError(
        res,
        error,
        "create"
      );
    }
  };

exports.updateStaffUser =
  async (
    req,
    res
  ) => {
    const userId =
      parsePositiveInteger(
        req.params.id
      );

    if (!userId) {
      return res
        .status(400)
        .json({
          code:
            "STAFF_INVALID_ID",
          error:
            "Invalid staff user ID.",
        });
    }

    const allowedFields = [
      "email",
      "name",
      "role",
      "isActive",
    ];

    const hasAnyField =
      allowedFields.some(
        (field) =>
          Object.prototype.hasOwnProperty.call(
            req.body ?? {},
            field
          )
      );

    if (!hasAnyField) {
      return sendValidationError(
        res,
        {
          staff:
            "Provide at least one field to update.",
        }
      );
    }

    const errors = {};
    const payload = {};

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "email"
      )
    ) {
      const result =
        validateEmail(
          req.body.email
        );

      if (result.error) {
        errors.email =
          result.error;
      } else {
        payload.email =
          result.value;
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "name"
      )
    ) {
      const result =
        validateName(
          req.body.name
        );

      if (result.error) {
        errors.name =
          result.error;
      } else {
        payload.name =
          result.value;
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "role"
      )
    ) {
      const result =
        validateRole(
          req.body.role
        );

      if (result.error) {
        errors.role =
          result.error;
      } else {
        payload.role =
          result.value;
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "isActive"
      )
    ) {
      const result =
        validateBoolean(
          req.body.isActive,
          "isActive"
        );

      if (result.error) {
        errors.isActive =
          result.error;
      } else {
        payload.isActive =
          result.value;
      }
    }

    if (
      Object.keys(
        errors
      ).length > 0
    ) {
      return sendValidationError(
        res,
        errors
      );
    }

    try {
      const result =
        await sequelize.transaction(
          async (
            transaction
          ) => {
            const user =
              await findUserById(
                userId,
                {
                  transaction,
                  lock:
                    transaction.LOCK.UPDATE,
                }
              );

            if (!user) {
              return {
                response: {
                  status: 404,
                  body: {
                    code:
                      "STAFF_NOT_FOUND",
                    error:
                      "Staff user not found.",
                  },
                },
              };
            }

            const nextRole =
              payload.role ??
              user.role;

            const nextIsActive =
              payload.isActive ??
              user.isActive;

            const safetyError =
              await ensureAdminSafety({
                actorUserId:
                  req.auth.user.id,

                targetUser:
                  user,

                nextRole,
                nextIsActive,
                transaction,
              });

            if (
              safetyError
            ) {
              return {
                response: {
                  status:
                    safetyError.status,

                  body: {
                    code:
                      safetyError.code,

                    error:
                      safetyError.error,
                  },
                },
              };
            }

            if (
              payload.email &&
              payload.email !==
                user.email
            ) {
              const existing =
                await ensureEmailAvailable(
                  payload.email,
                  user.id,
                  transaction
                );

              if (existing) {
                return {
                  response: {
                    status: 409,

                    body: {
                      code:
                        "STAFF_EMAIL_EXISTS",

                      error:
                        "A staff account with this email already exists.",
                    },
                  },
                };
              }
            }

            await user.update(
              payload,
              {
                transaction,
              }
            );

            let revokedSessions =
              0;

            if (
              user.isActive ===
              false
            ) {
              const [
                affectedCount,
              ] =
                await AuthSession.update(
                  {
                    revokedAt:
                      new Date(),
                  },
                  {
                    where: {
                      userId:
                        user.id,

                      revokedAt: {
                        [Op.is]:
                          null,
                      },
                    },

                    transaction,
                  }
                );

              revokedSessions =
                affectedCount;
            }

            return {
              user,
              revokedSessions,
            };
          }
        );

      if (
        result.response
      ) {
        return res
          .status(
            result.response
              .status
          )
          .json(
            result.response
              .body
          );
      }

      const sessionCounts =
        await countActiveSessions(
          [
            result.user.id,
          ]
        );

      return res
        .status(200)
        .json({
          user:
            serializeStaffUser(
              result.user,
              sessionCounts.get(
                result.user.id
              ) ?? 0
            ),

          revokedSessions:
            result.revokedSessions,
        });
    } catch (error) {
      return handleStaffError(
        res,
        error,
        "update"
      );
    }
  };

exports.resetStaffPassword =
  async (
    req,
    res
  ) => {
    const userId =
      parsePositiveInteger(
        req.params.id
      );

    if (!userId) {
      return res
        .status(400)
        .json({
          code:
            "STAFF_INVALID_ID",
          error:
            "Invalid staff user ID.",
        });
    }

    const password =
      req.body?.password;

    try {
      validatePassword(
        password
      );
    } catch (error) {
      return sendValidationError(
        res,
        {
          password:
            error.message,
        }
      );
    }

    try {
      const passwordHash =
        await hashPassword(
          password
        );

      const currentSessionId =
        req.auth.session.id;

      const result =
        await sequelize.transaction(
          async (
            transaction
          ) => {
            const user =
              await findUserById(
                userId,
                {
                  transaction,
                  lock:
                    transaction.LOCK.UPDATE,
                }
              );

            if (!user) {
              return {
                response: {
                  status: 404,
                  body: {
                    code:
                      "STAFF_NOT_FOUND",
                    error:
                      "Staff user not found.",
                  },
                },
              };
            }

            const now =
              new Date();

            await user.update(
              {
                passwordHash,
                passwordChangedAt:
                  now,
              },
              {
                transaction,
              }
            );

            const sessionWhere = {
              userId:
                user.id,

              revokedAt: {
                [Op.is]: null,
              },
            };

            const keptCurrentSession =
              user.id ===
              req.auth.user.id;

            if (
              keptCurrentSession
            ) {
              sessionWhere.id = {
                [Op.ne]:
                  currentSessionId,
              };
            }

            const [
              revokedSessions,
            ] =
              await AuthSession.update(
                {
                  revokedAt:
                    now,
                },
                {
                  where:
                    sessionWhere,

                  transaction,
                }
              );

            return {
              user,
              keptCurrentSession,
              revokedSessions,
            };
          }
        );

      if (
        result.response
      ) {
        return res
          .status(
            result.response
              .status
          )
          .json(
            result.response
              .body
          );
      }

      const sessionCounts =
        await countActiveSessions(
          [
            result.user.id,
          ]
        );

      return res
        .status(200)
        .json({
          user:
            serializeStaffUser(
              result.user,
              sessionCounts.get(
                result.user.id
              ) ?? 0
            ),

          revokedSessions:
            result.revokedSessions,

          keptCurrentSession:
            result.keptCurrentSession,
        });
    } catch (error) {
      return handleStaffError(
        res,
        error,
        "password reset"
      );
    }
  };

exports.revokeStaffSessions =
  async (
    req,
    res
  ) => {
    const userId =
      parsePositiveInteger(
        req.params.id
      );

    if (!userId) {
      return res
        .status(400)
        .json({
          code:
            "STAFF_INVALID_ID",
          error:
            "Invalid staff user ID.",
        });
    }

    try {
      const user =
        await User.findByPk(
          userId,
          {
            attributes: [
              "id",
            ],
          }
        );

      if (!user) {
        return res
          .status(404)
          .json({
            code:
              "STAFF_NOT_FOUND",
            error:
              "Staff user not found.",
          });
      }

      const keptCurrentSession =
        userId ===
        req.auth.user.id;

      const where = {
        userId,

        revokedAt: {
          [Op.is]: null,
        },

        expiresAt: {
          [Op.gt]:
            new Date(),
        },
      };

      if (
        keptCurrentSession
      ) {
        where.id = {
          [Op.ne]:
            req.auth.session.id,
        };
      }

      const [
        revokedSessions,
      ] =
        await AuthSession.update(
          {
            revokedAt:
              new Date(),
          },
          {
            where,
          }
        );

      return res
        .status(200)
        .json({
          userId,
          revokedSessions,
          keptCurrentSession,
        });
    } catch (error) {
      return handleStaffError(
        res,
        error,
        "session revocation"
      );
    }
  };
