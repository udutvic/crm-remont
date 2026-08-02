const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const FORMAT_VERSION = "v1";

const getAccessCodeKey = () => {
  const encodedKey = String(
    process.env.ORDER_ACCESS_CODE_KEY ?? ""
  ).trim();

  if (!encodedKey) {
    throw new Error(
      "ORDER_ACCESS_CODE_KEY is not configured."
    );
  }

  const key = Buffer.from(
    encodedKey,
    "base64"
  );

  if (key.length !== KEY_LENGTH) {
    throw new Error(
      "ORDER_ACCESS_CODE_KEY must be a base64-encoded 32-byte key."
    );
  }

  return key;
};

const assertAccessCodeKey = () => {
  getAccessCodeKey();
};

const encryptAccessCode = (value) => {
  const plaintext = String(
    value ?? ""
  );

  if (!plaintext) {
    throw new Error(
      "Access code cannot be empty."
    );
  }

  const key = getAccessCodeKey();
  const iv = crypto.randomBytes(
    IV_LENGTH
  );

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    key,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(
      plaintext,
      "utf8"
    ),
    cipher.final(),
  ]);

  const authenticationTag =
    cipher.getAuthTag();

  return [
    FORMAT_VERSION,
    iv.toString("base64"),
    authenticationTag.toString(
      "base64"
    ),
    encrypted.toString("base64"),
  ].join(":");
};

const decryptAccessCode = (
  encryptedValue
) => {
  const parts = String(
    encryptedValue ?? ""
  ).split(":");

  if (
    parts.length !== 4 ||
    parts[0] !== FORMAT_VERSION
  ) {
    throw new Error(
      "Unsupported encrypted access-code format."
    );
  }

  const [
    ,
    encodedIv,
    encodedAuthenticationTag,
    encodedCiphertext,
  ] = parts;

  const iv = Buffer.from(
    encodedIv,
    "base64"
  );

  const authenticationTag =
    Buffer.from(
      encodedAuthenticationTag,
      "base64"
    );

  const ciphertext = Buffer.from(
    encodedCiphertext,
    "base64"
  );

  if (iv.length !== IV_LENGTH) {
    throw new Error(
      "Invalid encrypted access-code IV."
    );
  }

  const decipher =
    crypto.createDecipheriv(
      ALGORITHM,
      getAccessCodeKey(),
      iv
    );

  decipher.setAuthTag(
    authenticationTag
  );

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

module.exports = {
  assertAccessCodeKey,
  encryptAccessCode,
  decryptAccessCode,
};