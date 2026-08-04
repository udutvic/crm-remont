require("dotenv").config();

const db = require(
  "../config/database"
);

const AuthSession = require(
  "../models/AuthSession"
);

const main = async () => {
  await db.authenticate();

  const [revokedCount] =
    await AuthSession.update(
      {
        revokedAt: new Date(),
      },
      {
        where: {
          revokedAt: null,
        },
      }
    );

  console.log(
    `Revoked ${revokedCount} active authentication session(s).`
  );
};

main()
  .catch(
    (error) => {
      console.error(
        "Failed to revoke authentication sessions:",
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
