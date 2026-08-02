const {
  createClient,
} = require(
  "@supabase/supabase-js"
);

let cachedClient = null;
let cachedConfig = null;

const createStorageError = (
  message
) => {
  const error =
    new Error(message);

  error.status = 503;
  error.code =
    "ORDER_PHOTO_STORAGE_NOT_CONFIGURED";

  return error;
};

const getStorageConfig =
  () => {
    if (cachedConfig) {
      return cachedConfig;
    }

    const url = String(
      process.env
        .SUPABASE_URL ??
        ""
    ).trim();

    const serviceRoleKey =
      String(
        process.env
          .SUPABASE_SERVICE_ROLE_KEY ??
          ""
      ).trim();

    const bucket = String(
      process.env
        .SUPABASE_STORAGE_BUCKET ??
        "order-photos"
    ).trim();

    if (
      !url ||
      !serviceRoleKey ||
      !bucket
    ) {
      throw createStorageError(
        "Order photo storage is not configured."
      );
    }

    cachedConfig = {
      url,
      serviceRoleKey,
      bucket,
    };

    return cachedConfig;
  };

const getStorageClient =
  () => {
    if (cachedClient) {
      return cachedClient;
    }

    const config =
      getStorageConfig();

    cachedClient =
      createClient(
        config.url,
        config.serviceRoleKey,
        {
          auth: {
            persistSession:
              false,
            autoRefreshToken:
              false,
            detectSessionInUrl:
              false,
          },
        }
      );

    return cachedClient;
  };

module.exports = {
  getStorageClient,
  getStorageConfig,
};
