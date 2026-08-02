const {
  randomUUID,
} = require(
  "crypto"
);

const Order = require(
  "../models/Order"
);

const OrderPhoto = require(
  "../models/OrderPhoto"
);

const User = require(
  "../models/User"
);

const {
  getStorageClient,
  getStorageConfig,
} = require(
  "../config/orderPhotoStorage"
);

const PHOTO_CATEGORIES =
  new Set(
    OrderPhoto
      .PHOTO_CATEGORIES
  );

const SIGNED_URL_SECONDS =
  60 * 60;

const mimeExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const parsePositiveId = (
  value
) => {
  const id =
    Number(value);

  return (
    Number.isInteger(id) &&
    id > 0
  )
    ? id
    : null;
};

const parseOptionalDimension = (
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number =
    Number(value);

  return (
    Number.isInteger(
      number
    ) &&
    number > 0 &&
    number <= 20000
  )
    ? number
    : null;
};

const normalizeCaption = (
  value
) => {
  const caption =
    String(
      value ?? ""
    ).trim();

  if (
    caption.length > 500
  ) {
    const error =
      new Error(
        "Photo caption cannot exceed 500 characters."
      );

    error.status = 400;
    error.code =
      "ORDER_PHOTO_CAPTION_TOO_LONG";

    throw error;
  }

  return caption || null;
};

const normalizeOriginalName = (
  value,
  fallback
) => {
  const normalized =
    String(
      value ?? fallback
    )
      .replace(
        /[\u0000-\u001f\u007f]/g,
        ""
      )
      .trim()
      .slice(
        0,
        255
      );

  return (
    normalized ||
    fallback
  );
};

const ensureOrder = async (
  orderId
) => {
  const order =
    await Order.findByPk(
      orderId,
      {
        attributes: [
          "id",
        ],
      }
    );

  if (!order) {
    const error =
      new Error(
        "Order not found."
      );

    error.status = 404;
    error.code =
      "ORDER_PHOTO_ORDER_NOT_FOUND";

    throw error;
  }
};

const serializePhoto =
  async (
    photo
  ) => {
    const plain =
      photo.get({
        plain: true,
      });

    const client =
      getStorageClient();

    const {
      bucket,
    } =
      getStorageConfig();

    const {
      data,
      error,
    } =
      await client.storage
        .from(bucket)
        .createSignedUrl(
          plain.storagePath,
          SIGNED_URL_SECONDS
        );

    if (
      error ||
      !data?.signedUrl
    ) {
      const storageError =
        new Error(
          "Could not create a signed photo URL."
        );

      storageError.status =
        502;

      storageError.code =
        "ORDER_PHOTO_SIGN_FAILED";

      throw storageError;
    }

    return {
      ...plain,
      signedUrl:
        data.signedUrl,
    };
  };

const includeUploader = [
  {
    model: User,
    as:
      "uploadedByUser",

    attributes: [
      "id",
      "name",
      "email",
      "role",
    ],
  },
];

const handleError = (
  res,
  error,
  operation
) => {
  if (
    error.status &&
    error.code
  ) {
    return res
      .status(
        error.status
      )
      .json({
        code:
          error.code,
        error:
          error.message,
      });
  }

  if (
    error.name ===
    "SequelizeValidationError"
  ) {
    return res
      .status(400)
      .json({
        code:
          "ORDER_PHOTO_VALIDATION_FAILED",
        error:
          "Photo metadata validation failed.",
      });
  }

  console.error(
    `Order photo ${operation} failed:`,
    error
  );

  return res
    .status(500)
    .json({
      code:
        "ORDER_PHOTO_INTERNAL_ERROR",
      error:
        "Internal server error.",
    });
};

exports.listPhotos = async (
  req,
  res
) => {
  const orderId =
    parsePositiveId(
      req.params.id
    );

  if (!orderId) {
    return res
      .status(400)
      .json({
        code:
          "ORDER_PHOTO_INVALID_ORDER_ID",
        error:
          "A valid order ID is required.",
      });
  }

  try {
    await ensureOrder(
      orderId
    );

    const photos =
      await OrderPhoto.findAll({
        where: {
          orderId,
        },

        include:
          includeUploader,

        order: [
          [
            "createdAt",
            "DESC",
          ],
          [
            "id",
            "DESC",
          ],
        ],
      });

    const serialized =
      await Promise.all(
        photos.map(
          serializePhoto
        )
      );

    return res.json({
      photos:
        serialized,
      signedUrlExpiresIn:
        SIGNED_URL_SECONDS,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "list"
    );
  }
};

exports.uploadPhoto = async (
  req,
  res
) => {
  const orderId =
    parsePositiveId(
      req.params.id
    );

  if (!orderId) {
    return res
      .status(400)
      .json({
        code:
          "ORDER_PHOTO_INVALID_ORDER_ID",
        error:
          "A valid order ID is required.",
      });
  }

  if (!req.file) {
    return res
      .status(400)
      .json({
        code:
          "ORDER_PHOTO_FILE_REQUIRED",
        error:
          "A photo file is required.",
      });
  }

  const category =
    String(
      req.body.category ??
        ""
    )
      .trim()
      .toLowerCase();

  if (
    !PHOTO_CATEGORIES.has(
      category
    )
  ) {
    return res
      .status(400)
      .json({
        code:
          "ORDER_PHOTO_CATEGORY_INVALID",
        error:
          "Unsupported photo category.",
      });
  }

  const width =
    parseOptionalDimension(
      req.body.width
    );

  const height =
    parseOptionalDimension(
      req.body.height
    );

  if (
    (
      req.body.width &&
      !width
    ) ||
    (
      req.body.height &&
      !height
    )
  ) {
    return res
      .status(400)
      .json({
        code:
          "ORDER_PHOTO_DIMENSIONS_INVALID",
        error:
          "Photo dimensions are invalid.",
      });
  }

  let storagePath = null;

  try {
    await ensureOrder(
      orderId
    );

    const caption =
      normalizeCaption(
        req.body.caption
      );

    const extension =
      mimeExtensions[
        req.file.mimetype
      ];

    if (!extension) {
      const error =
        new Error(
          "Unsupported image type."
        );

      error.status = 400;
      error.code =
        "ORDER_PHOTO_TYPE_UNSUPPORTED";

      throw error;
    }

    const now =
      new Date();

    const year =
      now
        .getUTCFullYear();

    const month =
      String(
        now.getUTCMonth() +
          1
      ).padStart(
        2,
        "0"
      );

    storagePath =
      `orders/${orderId}/${year}/${month}/${randomUUID()}.${extension}`;

    const client =
      getStorageClient();

    const {
      bucket,
    } =
      getStorageConfig();

    const arrayBuffer =
      req.file.buffer
        .buffer.slice(
          req.file.buffer
            .byteOffset,
          req.file.buffer
            .byteOffset +
            req.file.buffer
              .byteLength
        );

    const {
      error:
        uploadError,
    } =
      await client.storage
        .from(bucket)
        .upload(
          storagePath,
          arrayBuffer,
          {
            cacheControl:
              "3600",
            contentType:
              req.file.mimetype,
            upsert: false,
          }
        );

    if (uploadError) {
      const error =
        new Error(
          "Could not upload the photo to storage."
        );

      error.status = 502;
      error.code =
        "ORDER_PHOTO_STORAGE_UPLOAD_FAILED";

      throw error;
    }

    let photo;

    try {
      photo =
        await OrderPhoto.create({
          orderId,
          storagePath,
          category,
          caption,

          originalName:
            normalizeOriginalName(
              req.body
                .originalName,
              req.file
                .originalname
            ),

          mimeType:
            req.file
              .mimetype,

          fileSize:
            req.file.size,

          width,
          height,

          uploadedBy:
            req.auth
              ?.user?.id ??
            null,
        });
    } catch (databaseError) {
      await client.storage
        .from(bucket)
        .remove([
          storagePath,
        ]);

      throw databaseError;
    }

    const loadedPhoto =
      await OrderPhoto.findByPk(
        photo.id,
        {
          include:
            includeUploader,
        }
      );

    const serialized =
      await serializePhoto(
        loadedPhoto
      );

    return res
      .status(201)
      .json({
        photo:
          serialized,
      });
  } catch (error) {
    return handleError(
      res,
      error,
      "upload"
    );
  }
};

exports.deletePhoto = async (
  req,
  res
) => {
  const orderId =
    parsePositiveId(
      req.params.id
    );

  const photoId =
    parsePositiveId(
      req.params.photoId
    );

  if (
    !orderId ||
    !photoId
  ) {
    return res
      .status(400)
      .json({
        code:
          "ORDER_PHOTO_INVALID_ID",
        error:
          "Valid order and photo IDs are required.",
      });
  }

  try {
    const photo =
      await OrderPhoto.findOne({
        where: {
          id: photoId,
          orderId,
        },
      });

    if (!photo) {
      const error =
        new Error(
          "Photo not found."
        );

      error.status = 404;
      error.code =
        "ORDER_PHOTO_NOT_FOUND";

      throw error;
    }

    const client =
      getStorageClient();

    const {
      bucket,
    } =
      getStorageConfig();

    const {
      error:
        removeError,
    } =
      await client.storage
        .from(bucket)
        .remove([
          photo.storagePath,
        ]);

    if (removeError) {
      const error =
        new Error(
          "Could not delete the photo from storage."
        );

      error.status = 502;
      error.code =
        "ORDER_PHOTO_STORAGE_DELETE_FAILED";

      throw error;
    }

    await photo.destroy();

    return res
      .status(204)
      .send();
  } catch (error) {
    return handleError(
      res,
      error,
      "delete"
    );
  }
};
