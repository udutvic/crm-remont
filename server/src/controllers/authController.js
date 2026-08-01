const {
  Op,
} = require(
  "sequelize"
);

const {
  cookieName,
  getCookieOptions,
  getSessionExpiry,
} = require(
  "../config/auth"
);

const AuthSession = require(
  "../models/AuthSession"
);

const User = require(
  "../models/User"
);

const {
  clearFailedAttempts,
  recordFailedAttempt,
} = require(
  "../middleware/authRateLimit"
);

const {
  clearSessionCookie,
  publicUser,
} = require(
  "../middleware/authenticate"
);

const {
  parseCookies,
} = require(
  "../utils/cookies"
);

const {
  verifyPassword,
} = require(
  "../utils/passwordHash"
);

const {
  createSessionToken,
  hashSessionToken,
} = require(
  "../utils/sessionToken"
);

const MAX_ACTIVE_SESSIONS =
  10;

const normalizeEmail = (
  value
) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const serializeUser = (
  user
) =>
  publicUser(user);

const revokeExcessSessions =
  async (
    userId
  ) => {
    const activeSessions =
      await AuthSession.findAll(
        {
          where: {
            userId,

            revokedAt: {
              [Op.is]: null,
            },

            expiresAt: {
              [Op.gt]:
                new Date(),
            },
          },

          order: [
            [
              "lastUsedAt",
              "DESC",
            ],
          ],
        }
      );

    const excess =
      activeSessions.slice(
        MAX_ACTIVE_SESSIONS -
          1
      );

    if (
      excess.length === 0
    ) {
      return;
    }

    await AuthSession.update(
      {
        revokedAt:
          new Date(),
      },
      {
        where: {
          id: {
            [Op.in]:
              excess.map(
                (
                  session
                ) =>
                  session.id
              ),
          },
        },
      }
    );
  };

exports.login = async (
  req,
  res,
  next
) => {
  const email =
    normalizeEmail(
      req.body?.email
    );

  const password =
    req.body?.password;

  if (
    !email ||
    typeof password !==
      "string" ||
    password.length === 0
  ) {
    recordFailedAttempt(
      req.authRateLimitKey
    );

    return res
      .status(400)
      .json({
        code:
          "AUTH_INVALID_INPUT",
        error:
          "Email and password are required.",
      });
  }

  try {
    const user =
      await User.scope(
        "withPassword"
      ).findOne({
        where: {
          email,
        },
      });

    const passwordValid =
      user
        ? await verifyPassword(
            password,
            user.passwordHash
          )
        : false;

    if (
      !user ||
      !passwordValid
    ) {
      recordFailedAttempt(
        req.authRateLimitKey
      );

      return res
        .status(401)
        .json({
          code:
            "AUTH_INVALID_CREDENTIALS",
          error:
            "Invalid email or password.",
        });
    }

    if (!user.isActive) {
      recordFailedAttempt(
        req.authRateLimitKey
      );

      return res
        .status(403)
        .json({
          code:
            "AUTH_ACCOUNT_DISABLED",
          error:
            "This account is disabled.",
        });
    }

    clearFailedAttempts(
      req.authRateLimitKey
    );

    await AuthSession.destroy(
      {
        where: {
          [Op.or]: [
            {
              expiresAt: {
                [Op.lte]:
                  new Date(),
              },
            },
            {
              revokedAt: {
                [Op.ne]:
                  null,
              },
            },
          ],
        },
      }
    );

    await revokeExcessSessions(
      user.id
    );

    const {
      token,
      tokenHash,
    } =
      createSessionToken();

    const now =
      new Date();

    await AuthSession.create(
      {
        userId:
          user.id,

        tokenHash,

        expiresAt:
          getSessionExpiry(),

        lastUsedAt:
          now,

        userAgent:
          String(
            req.get(
              "user-agent"
            ) ?? ""
          ).slice(
            0,
            512
          ) || null,

        ipAddress:
          String(
            req.ip ?? ""
          ).slice(
            0,
            64
          ) || null,
      }
    );

    await user.update({
      lastLoginAt: now,
    });

    req.auditUserId =
      user.id;

    res.cookie(
      cookieName,
      token,
      getCookieOptions()
    );

    return res
      .status(200)
      .json({
        user:
          serializeUser(
            user
          ),
      });
  } catch (error) {
    return next(
      error
    );
  }
};

exports.logout = async (
  req,
  res,
  next
) => {
  try {
    const cookies =
      parseCookies(
        req.headers.cookie
      );

    const token =
      cookies[
        cookieName
      ];

    if (token) {
      await AuthSession.update(
        {
          revokedAt:
            new Date(),
        },
        {
          where: {
            tokenHash:
              hashSessionToken(
                token
              ),

            revokedAt: {
              [Op.is]: null,
            },
          },
        }
      );
    }

    clearSessionCookie(
      res
    );

    return res
      .status(204)
      .send();
  } catch (error) {
    return next(
      error
    );
  }
};

exports.me = (
  req,
  res
) => {
  return res
    .status(200)
    .json({
      user:
        req.auth.user,
    });
};
