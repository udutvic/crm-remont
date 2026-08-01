const {
  createHash,
  randomBytes,
} = require("crypto");

const createSessionToken =
  () => {
    const token =
      randomBytes(32)
        .toString(
          "base64url"
        );

    return {
      token,
      tokenHash:
        hashSessionToken(
          token
        ),
    };
  };

const hashSessionToken = (
  token
) =>
  createHash("sha256")
    .update(
      String(token ?? ""),
      "utf8"
    )
    .digest("hex");

module.exports = {
  createSessionToken,
  hashSessionToken,
};
