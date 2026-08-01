const WINDOW_MS =
  15 * 60 * 1000;

const MAX_ATTEMPTS = 10;

const attempts =
  new Map();

const getKey = (
  req
) => {
  const email =
    String(
      req.body?.email ??
        ""
    )
      .trim()
      .toLowerCase();

  return `${req.ip}|${email}`;
};

const cleanupExpired =
  () => {
    const now =
      Date.now();

    for (
      const [
        key,
        value,
      ] of attempts
    ) {
      if (
        value.resetAt <=
        now
      ) {
        attempts.delete(
          key
        );
      }
    }
  };

const authRateLimit = (
  req,
  res,
  next
) => {
  cleanupExpired();

  const key =
    getKey(req);

  const now =
    Date.now();

  const current =
    attempts.get(
      key
    );

  if (
    current &&
    current.count >=
      MAX_ATTEMPTS &&
    current.resetAt > now
  ) {
    const retryAfter =
      Math.ceil(
        (
          current.resetAt -
          now
        ) /
          1000
      );

    res.setHeader(
      "Retry-After",
      retryAfter
    );

    return res
      .status(429)
      .json({
        code:
          "AUTH_RATE_LIMITED",
        error:
          "Too many login attempts. Try again later.",
      });
  }

  req.authRateLimitKey =
    key;

  return next();
};

const recordFailedAttempt = (
  key
) => {
  if (!key) {
    return;
  }

  const now =
    Date.now();

  const current =
    attempts.get(
      key
    );

  if (
    !current ||
    current.resetAt <=
      now
  ) {
    attempts.set(
      key,
      {
        count: 1,
        resetAt:
          now +
          WINDOW_MS,
      }
    );

    return;
  }

  current.count += 1;
};

const clearFailedAttempts = (
  key
) => {
  if (key) {
    attempts.delete(
      key
    );
  }
};

module.exports = {
  authRateLimit,
  clearFailedAttempts,
  recordFailedAttempt,
};
