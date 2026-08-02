const express = require(
  "express"
);

const authController =
  require(
    "../controllers/authController"
  );

const {
  authRateLimit,
} = require(
  "../middleware/authRateLimit"
);

const {
  auditAuthAction,
} = require(
  "../middleware/auditRequest"
);

const {
  optionalAuth,
  requireAuth,
} = require(
  "../middleware/authenticate"
);

const requireAllowedOrigin =
  require(
    "../middleware/requireAllowedOrigin"
  );

const router =
  express.Router();

router.post(
  "/login",
  requireAllowedOrigin,
  authRateLimit,
  auditAuthAction(
    "AUTH_LOGIN"
  ),
  authController.login
);

router.post(
  "/logout",
  requireAllowedOrigin,
  optionalAuth,
  auditAuthAction(
    "AUTH_LOGOUT"
  ),
  authController.logout
);

router.get(
  "/me",
  requireAuth,
  authController.me
);

module.exports =
  router;
