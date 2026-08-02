export const MAX_SOURCE_BYTES =
  8 * 1024 * 1024;

export const MAX_UPLOAD_BYTES =
  5 * 1024 * 1024;

const MAX_DIMENSION =
  1920;

const allowedTypes =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

export interface PreparedOrderPhoto {
  file: File;
  width: number;
  height: number;
  compressed: boolean;
}

const loadImage = (
  file: File
): Promise<{
  image: HTMLImageElement;
  release: () => void;
}> => {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const url =
        URL.createObjectURL(
          file
        );

      const image =
        new Image();

      image.onload =
        () => {
          resolve({
            image,

            release() {
              URL.revokeObjectURL(
                url
              );
            },
          });
        };

      image.onerror =
        () => {
          URL.revokeObjectURL(
            url
          );

          reject(
            new Error(
              "IMAGE_DECODE_FAILED"
            )
          );
        };

      image.src = url;
    }
  );
};

const canvasToBlob = (
  canvas:
    HTMLCanvasElement,
  quality: number
): Promise<Blob> => {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      canvas.toBlob(
        (
          blob
        ) => {
          if (!blob) {
            reject(
              new Error(
                "IMAGE_COMPRESS_FAILED"
              )
            );

            return;
          }

          resolve(blob);
        },
        "image/webp",
        quality
      );
    }
  );
};

const baseName = (
  fileName: string
): string => {
  const withoutExtension =
    fileName.replace(
      /\.[^.]+$/,
      ""
    );

  return (
    withoutExtension ||
    "photo"
  )
    .replace(
      /[^a-zA-Z0-9_-]+/g,
      "-"
    )
    .slice(
      0,
      100
    );
};

export const prepareOrderPhoto =
  async (
    source: File
  ): Promise<PreparedOrderPhoto> => {
    if (
      !allowedTypes.has(
        source.type
      )
    ) {
      throw new Error(
        "IMAGE_TYPE_UNSUPPORTED"
      );
    }

    if (
      source.size >
      MAX_SOURCE_BYTES
    ) {
      throw new Error(
        "IMAGE_SOURCE_TOO_LARGE"
      );
    }

    const {
      image,
      release,
    } =
      await loadImage(
        source
      );

    try {
      const sourceWidth =
        image.naturalWidth;

      const sourceHeight =
        image.naturalHeight;

      if (
        !sourceWidth ||
        !sourceHeight
      ) {
        throw new Error(
          "IMAGE_DIMENSIONS_INVALID"
        );
      }

      const scale =
        Math.min(
          1,
          MAX_DIMENSION /
            Math.max(
              sourceWidth,
              sourceHeight
            )
        );

      const width =
        Math.max(
          1,
          Math.round(
            sourceWidth *
              scale
          )
        );

      const height =
        Math.max(
          1,
          Math.round(
            sourceHeight *
              scale
          )
        );

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        width;

      canvas.height =
        height;

      const context =
        canvas.getContext(
          "2d",
          {
            alpha: false,
          }
        );

      if (!context) {
        throw new Error(
          "IMAGE_CANVAS_UNAVAILABLE"
        );
      }

      context.drawImage(
        image,
        0,
        0,
        width,
        height
      );

      let blob =
        await canvasToBlob(
          canvas,
          0.84
        );

      if (
        blob.size >
        MAX_UPLOAD_BYTES
      ) {
        blob =
          await canvasToBlob(
            canvas,
            0.68
          );
      }

      if (
        blob.size >
        MAX_UPLOAD_BYTES
      ) {
        throw new Error(
          "IMAGE_COMPRESSED_TOO_LARGE"
        );
      }

      const file =
        new File(
          [
            blob,
          ],
          `${baseName(
            source.name
          )}.webp`,
          {
            type:
              "image/webp",

            lastModified:
              Date.now(),
          }
        );

      return {
        file,
        width,
        height,

        compressed:
          file.size <
            source.size ||
          width !==
            sourceWidth ||
          height !==
            sourceHeight ||
          source.type !==
            "image/webp",
      };
    } finally {
      release();
    }
  };
