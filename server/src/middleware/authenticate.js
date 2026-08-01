const {
  Op,
} = require(
  "sequelize"
);

const {
  cookieName,
  getCookieOptions,
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
  parseCookies,
} = require(
  "../utils/cookies"
);

const {
  hashSessionToken,
} = require(
  "../utils/sessionToken"
);

const LAST_USED_UPDATE_INTERVAL_MS =
  5 * 60 * 1000;

const publicUser = (
  user
) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  isActive:
    user.isActive,
  lastLoginAt:
    user.lastLoginAt,
});

const clearSessionCookie = (
  res
) => {
  res.clearCookie(
    cookieName,
    getCookieOptions({
      clear: true,
    })
  );
};

const authenticate = (
  {
    required = true,
  } = {}
) =>
  async (
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

      if (!token) {
        if (required) {
          return res
            .status(401)
            .json({
              code:
                "AUTH_REQUIRED",
              error:
                "Authentication required.",
            });
        }

        req.auth = null;
        return next();
      }

      const tokenHash =
        hashSessionToken(
          token
        );

      const session =
        await AuthSession.findOne(
          {
            where: {
              tokenHash,

              revokedAt: {
                [Op.is]: null,
              },

              expiresAt: {
                [Op.gt]:
                  new Date(),
              },
            },

            include: [
              {
                model: User,
                as: "user",
                required: true,
              },
            ],
          }
        );

      if (
        !session ||
        !session.user ||
        !session.user
          .isActive
      ) {
        clearSessionCookie(
          res
        );

        if (required) {
          return res
            .status(401)
            .json({
              code:
                "AUTH_INVALID_SESSION",
              error:
                "Session is invalid or expired.",
            });
        }

        req.auth = null;
        return next();
      }

      const lastUsedAt =
        new Date(
          session.lastUsedAt
        ).getTime();

      if (
        !Number.isFinite(
          lastUsedAt
        ) ||
        Date.now() -
          lastUsedAt >
          LAST_USED_UPDATE_INTERVAL_MS
      ) {
        void session
          .update({
            lastUsedAt:
              new Date(),
          })
          .catch(
            (error) => {
              console.error(
                "Failed to update session activity:",
                error
              );
            }
          );
      }

      req.auth = {
        session,
        user:
          publicUser(
            session.user
          ),
      };

      return next();
    } catch (error) {
      return next(
        error
      );
    }
  };

const requireAuth =
  authenticate({
    required: true,
  });

const optionalAuth =
  authenticate({
    required: false,
  });

module.exports = {
  clearSessionCookie,
  optionalAuth,
  publicUser,
  requireAuth,
};
