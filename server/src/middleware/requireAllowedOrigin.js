const {
  isAllowedOrigin,
} = require(
  "../config/http"
);

const requireAllowedOrigin = (
  req,
  res,
  next
) => {
  const origin =
    req.get("origin");

  if (
    !isAllowedOrigin(
      origin
    )
  ) {
    return res
      .status(403)
      .json({
        code:
          "ORIGIN_FORBIDDEN",
        error:
          "Request origin is not allowed.",
      });
  }

  return next();
};

module.exports =
  requireAllowedOrigin;
