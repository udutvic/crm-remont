const multer =
  require("multer");

const MAX_UPLOAD_BYTES =
  6 * 1024 * 1024;

const allowedMimeTypes =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

const upload =
  multer({
    storage:
      multer.memoryStorage(),

    limits: {
      files: 1,
      fileSize:
        MAX_UPLOAD_BYTES,
    },

    fileFilter(
      req,
      file,
      callback
    ) {
      if (
        !allowedMimeTypes.has(
          file.mimetype
        )
      ) {
        const error =
          new Error(
            "Unsupported image type."
          );

        error.code =
          "ORDER_PHOTO_TYPE_UNSUPPORTED";

        callback(error);
        return;
      }

      callback(
        null,
        true
      );
    },
  });

const orderPhotoUpload = (
  req,
  res,
  next
) => {
  upload.single(
    "photo"
  )(
    req,
    res,
    (
      error
    ) => {
      if (!error) {
        next();
        return;
      }

      if (
        error instanceof
          multer.MulterError &&
        error.code ===
          "LIMIT_FILE_SIZE"
      ) {
        res.status(413).json({
          code:
            "ORDER_PHOTO_TOO_LARGE",
          error:
            "The compressed photo cannot exceed 6 MB.",
        });

        return;
      }

      if (
        error.code ===
        "ORDER_PHOTO_TYPE_UNSUPPORTED"
      ) {
        res.status(400).json({
          code:
            error.code,
          error:
            error.message,
        });

        return;
      }

      res.status(400).json({
        code:
          "ORDER_PHOTO_UPLOAD_INVALID",
        error:
          "The photo upload is invalid.",
      });
    }
  );
};

orderPhotoUpload.MAX_UPLOAD_BYTES =
  MAX_UPLOAD_BYTES;

module.exports =
  orderPhotoUpload;
