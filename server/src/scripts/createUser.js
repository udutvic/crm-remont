require("dotenv").config();

const db = require(
  "../config/database"
);

const User = require(
  "../models/User"
);

const {
  hashPassword,
  validatePassword,
} = require(
  "../utils/passwordHash"
);

const getArgument = (
  name
) => {
  const prefix =
    `--${name}=`;

  const inline =
    process.argv.find(
      (argument) =>
        argument.startsWith(
          prefix
        )
    );

  if (inline) {
    return inline.slice(
      prefix.length
    );
  }

  const index =
    process.argv.indexOf(
      `--${name}`
    );

  if (
    index !== -1 &&
    process.argv[
      index + 1
    ]
  ) {
    return process.argv[
      index + 1
    ];
  }

  return "";
};

const main = async () => {
  const email =
    getArgument(
      "email"
    )
      .trim()
      .toLowerCase();

  const name =
    getArgument(
      "name"
    ).trim();

  const role =
    (
      getArgument(
        "role"
      ) ||
      "technician"
    )
      .trim()
      .toLowerCase();

  const password =
    process.env
      .AUTH_NEW_USER_PASSWORD;

  if (
    !email ||
    !name
  ) {
    throw new Error(
      "Usage: npm run auth:create-user -- --email user@example.com --name \"User Name\" --role admin"
    );
  }

  if (
    !User.USER_ROLES.includes(
      role
    )
  ) {
    throw new Error(
      "Role must be admin or technician."
    );
  }

  validatePassword(
    password
  );

  await db.authenticate();

  const existing =
    await User.unscoped().findOne(
      {
        where: {
          email,
        },
      }
    );

  if (existing) {
    throw new Error(
      `A user with email ${email} already exists.`
    );
  }

  const passwordHash =
    await hashPassword(
      password
    );

  const user =
    await User.create({
      email,
      name,
      role,
      passwordHash,
      isActive: true,
      passwordChangedAt:
        new Date(),
    });

  console.log(
    `Created ${user.role} user: ${user.email}`
  );
};

main()
  .catch(
    (error) => {
      console.error(
        "Failed to create user:",
        error instanceof
          Error
          ? error.message
          : error
      );

      process.exitCode = 1;
    }
  )
  .finally(
    async () => {
      await db.close();
    }
  );
