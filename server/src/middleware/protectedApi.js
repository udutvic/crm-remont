const {
  requireAuth,
} = require(
  "./authenticate"
);

const requireAllowedOrigin =
  require(
    "./requireAllowedOrigin"
  );

/*
 * All private API requests require
 * a valid database-backed session.
 *
 * Origin validation additionally
 * prevents a foreign browser origin
 * from using the authentication cookie.
 *
 * Requests without an Origin header
 * remain available to trusted CLI and
 * server-to-server tools.
 */
module.exports = [
  requireAuth,
  requireAllowedOrigin,
];
