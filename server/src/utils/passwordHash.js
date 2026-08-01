const {
  randomBytes,
  scrypt,
  timingSafeEqual,
} = require("crypto");

const {
  promisify,
} = require("util");

const scryptAsync =
  promisify(scrypt);

const ALGORITHM = "scrypt";
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

const PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem:
    64 * 1024 * 1024,
};

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

const validatePassword = (
  password
) => {
  if (
    typeof password !==
    "string"
  ) {
    throw new Error(
      "Password must be a string."
    );
  }

  if (
    password.length <
    MIN_PASSWORD_LENGTH
  ) {
    throw new Error(
      `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`
    );
  }

  if (
    password.length >
    MAX_PASSWORD_LENGTH
  ) {
    throw new Error(
      `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.`
    );
  }
};

const deriveKey = async (
  password,
  salt,
  params = PARAMS
) => {
  const result =
    await scryptAsync(
      password,
      salt,
      KEY_LENGTH,
      params
    );

  return Buffer.from(
    result
  );
};

const hashPassword = async (
  password
) => {
  validatePassword(
    password
  );

  const salt =
    randomBytes(
      SALT_LENGTH
    );

  const derivedKey =
    await deriveKey(
      password,
      salt
    );

  return [
    ALGORITHM,
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("hex"),
    derivedKey.toString(
      "hex"
    ),
  ].join("$");
};

const verifyPassword = async (
  password,
  storedHash
) => {
  if (
    typeof password !==
      "string" ||
    typeof storedHash !==
      "string"
  ) {
    return false;
  }

  const parts =
    storedHash.split("$");

  if (
    parts.length !== 6 ||
    parts[0] !== ALGORITHM
  ) {
    return false;
  }

  const [
    ,
    rawN,
    rawR,
    rawP,
    saltHex,
    hashHex,
  ] = parts;

  const N = Number(rawN);
  const r = Number(rawR);
  const p = Number(rawP);

  if (
    !Number.isInteger(N) ||
    !Number.isInteger(r) ||
    !Number.isInteger(p) ||
    !/^[a-f0-9]+$/i.test(
      saltHex
    ) ||
    !/^[a-f0-9]+$/i.test(
      hashHex
    )
  ) {
    return false;
  }

  try {
    const expected =
      Buffer.from(
        hashHex,
        "hex"
      );

    const actual =
      await deriveKey(
        password,
        Buffer.from(
          saltHex,
          "hex"
        ),
        {
          N,
          r,
          p,
          maxmem:
            64 *
            1024 *
            1024,
        }
      );

    return (
      expected.length ===
        actual.length &&
      timingSafeEqual(
        expected,
        actual
      )
    );
  } catch {
    return false;
  }
};

module.exports = {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  hashPassword,
  validatePassword,
  verifyPassword,
};
