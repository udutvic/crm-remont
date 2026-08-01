const DEFAULT_TTL_DAYS = 7;
const MAX_TTL_DAYS = 30;

const parseBoolean = (
  value,
  fallback
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  return [
    "1",
    "true",
    "yes",
    "on",
  ].includes(
    String(value)
      .trim()
      .toLowerCase()
  );
};

const parseTtlDays = (
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return DEFAULT_TTL_DAYS;
  }

  const parsed =
    Number(value);

  if (
    !Number.isInteger(
      parsed
    ) ||
    parsed < 1 ||
    parsed > MAX_TTL_DAYS
  ) {
    throw new Error(
      `AUTH_SESSION_TTL_DAYS must be an integer between 1 and ${MAX_TTL_DAYS}.`
    );
  }

  return parsed;
};

const parseSameSite = (
  value
) => {
  const normalized =
    String(
      value ?? "lax"
    )
      .trim()
      .toLowerCase();

  if (
    ![
      "lax",
      "strict",
      "none",
    ].includes(
      normalized
    )
  ) {
    throw new Error(
      "AUTH_COOKIE_SAME_SITE must be lax, strict, or none."
    );
  }

  return normalized;
};

const sessionTtlDays =
  parseTtlDays(
    process.env
      .AUTH_SESSION_TTL_DAYS
  );

const secureCookie =
  parseBoolean(
    process.env
      .AUTH_COOKIE_SECURE,
    process.env.NODE_ENV ===
      "production"
  );

const sameSite =
  parseSameSite(
    process.env
      .AUTH_COOKIE_SAME_SITE
  );

if (
  sameSite === "none" &&
  !secureCookie
) {
  throw new Error(
    "AUTH_COOKIE_SECURE must be true when AUTH_COOKIE_SAME_SITE=none."
  );
}

const cookieName =
  String(
    process.env
      .AUTH_COOKIE_NAME ??
      "crm_remont_session"
  ).trim();

if (
  !/^[A-Za-z0-9_-]{1,64}$/.test(
    cookieName
  )
) {
  throw new Error(
    "AUTH_COOKIE_NAME contains unsupported characters."
  );
}

const cookieDomain =
  String(
    process.env
      .AUTH_COOKIE_DOMAIN ??
      ""
  ).trim() || undefined;

const sessionTtlMs =
  sessionTtlDays *
  24 *
  60 *
  60 *
  1000;

const getSessionExpiry =
  () =>
    new Date(
      Date.now() +
        sessionTtlMs
    );

const getCookieOptions = (
  {
    clear = false,
  } = {}
) => {
  const options = {
    httpOnly: true,
    secure: secureCookie,
    sameSite,
    path: "/",
  };

  if (cookieDomain) {
    options.domain =
      cookieDomain;
  }

  if (clear) {
    return options;
  }

  return {
    ...options,
    maxAge:
      sessionTtlMs,
  };
};

module.exports = {
  cookieName,
  getCookieOptions,
  getSessionExpiry,
  sessionTtlDays,
  sessionTtlMs,
};
