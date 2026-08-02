const defaultAllowedOrigins = [
  "https://crm-remont.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const renderExternalUrl =
  String(
    process.env
      .RENDER_EXTERNAL_URL ??
      ""
  ).trim();

const configuredOrigins =
  String(
    process.env.CORS_ORIGINS ??
      ""
  )
    .split(",")
    .map(
      (origin) =>
        origin.trim()
    )
    .filter(Boolean);

const allowedOrigins =
  configuredOrigins.length > 0
    ? configuredOrigins
    : [
        ...defaultAllowedOrigins,
        renderExternalUrl,
      ].filter(Boolean);

const allowedOriginSet =
  new Set(
    allowedOrigins
  );

const isAllowedOrigin = (
  origin
) => {
  if (!origin) {
    return true;
  }

  return allowedOriginSet.has(
    origin
  );
};

module.exports = {
  allowedOrigins,
  isAllowedOrigin,
};
