import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  ChangeEvent,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  AddPhotoAlternateOutlined as AddPhotoIcon,
  DeleteOutline as DeleteIcon,
  PhotoCameraOutlined as CameraIcon,
  PhotoLibraryOutlined as GalleryIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import useAuth from "features/auth/context/useAuth";
import useAppFormatters from "hooks/useAppFormatters";
import {
  deleteOrderPhoto,
  getOrderPhotos,
  uploadOrderPhoto,
} from "index";
import type {
  OrderPhoto,
  OrderPhotoCategory,
} from "types";

import {
  MAX_SOURCE_BYTES,
  prepareOrderPhoto,
} from "../utils/prepareOrderPhoto";

interface OrderPhotosSectionProps {
  orderId: number;
}

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

const categories:
  OrderPhotoCategory[] = [
    "before",
    "during",
    "after",
  ];

const categoryKeys:
  Record<
    OrderPhotoCategory,
    string
  > = {
    before:
      "orderPhotos.categories.before",
    during:
      "orderPhotos.categories.during",
    after:
      "orderPhotos.categories.after",
  };

const errorKeys:
  Record<
    string,
    string
  > = {
    ORDER_PHOTO_STORAGE_NOT_CONFIGURED:
      "orderPhotos.errors.notConfigured",
    ORDER_PHOTO_TOO_LARGE:
      "orderPhotos.errors.tooLarge",
    ORDER_PHOTO_TYPE_UNSUPPORTED:
      "orderPhotos.errors.type",
    ORDER_PHOTO_CATEGORY_INVALID:
      "orderPhotos.errors.category",
    ORDER_PHOTO_CAPTION_TOO_LONG:
      "orderPhotos.errors.caption",
  };

const formatMegabytes = (
  bytes: number
): string =>
  `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;

const OrderPhotosSection = ({
  orderId,
}: OrderPhotosSectionProps) => {
  const {
    t,
  } = useTranslation();

  const {
    user,
  } = useAuth();

  const {
    formatDateTime,
  } = useAppFormatters();

  const [
    photos,
    setPhotos,
  ] = useState<
    OrderPhoto[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploadOpen,
    setUploadOpen,
  ] = useState(false);

  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState<
    File[]
  >([]);

  const [
    category,
    setCategory,
  ] =
    useState<OrderPhotoCategory>(
      "before"
    );

  const [
    caption,
    setCaption,
  ] = useState("");

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState("");

  const [
    previewPhoto,
    setPreviewPhoto,
  ] = useState<
    OrderPhoto | null
  >(null);

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    number | null
  >(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<
    string | null
  >(null);

  const isAdmin =
    user?.role ===
    "admin";

  const getErrorMessage =
    useCallback(
      (
        error: unknown,
        fallbackKey:
          | "load"
          | "upload"
          | "delete"
      ): string => {
        const axiosError =
          error as AxiosError<ApiErrorResponse>;

        const code =
          axiosError.response
            ?.data?.code;

        if (
          code &&
          errorKeys[code]
        ) {
          return t(
            errorKeys[code]
          );
        }

        return (
          axiosError.response
            ?.data?.error ??
          t(
            `orderPhotos.errors.${fallbackKey}`
          )
        );
      },
      [t]
    );

  const loadPhotos =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(true);
          setErrorMessage(
            null
          );

          const response =
            await getOrderPhotos(
              orderId
            );

          setPhotos(
            response.photos
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Order photos load failed:",
            error
          );

          setErrorMessage(
            getErrorMessage(
              error,
              "load"
            )
          );
        } finally {
          setLoading(false);
        }
      },
      [
        getErrorMessage,
        orderId,
      ]
    );

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos]);

  const groupedPhotos =
    useMemo(
      () =>
        Object.fromEntries(
          categories.map(
            (
              itemCategory
            ) => [
              itemCategory,
              photos.filter(
                (
                  photo
                ) =>
                  photo.category ===
                  itemCategory
              ),
            ]
          )
        ) as Record<
          OrderPhotoCategory,
          OrderPhoto[]
        >,
      [photos]
    );

  const closeUpload =
    (): void => {
      if (uploading) {
        return;
      }

      setUploadOpen(
        false
      );

      setSelectedFiles(
        []
      );

      setCaption("");
      setCategory(
        "before"
      );

      setUploadProgress(
        ""
      );

      setErrorMessage(
        null
      );
    };

  const selectFiles = (
    event:
      ChangeEvent<HTMLInputElement>
  ): void => {
    const files =
      Array.from(
        event.target
          .files ??
          []
      );

    event.target.value =
      "";

    if (
      files.length > 8
    ) {
      setErrorMessage(
        t(
          "orderPhotos.errors.count"
        )
      );

      return;
    }

    const invalid =
      files.find(
        (
          file
        ) =>
          ![
            "image/jpeg",
            "image/png",
            "image/webp",
          ].includes(
            file.type
          ) ||
          file.size >
            MAX_SOURCE_BYTES
      );

    if (invalid) {
      setErrorMessage(
        invalid.size >
          MAX_SOURCE_BYTES
          ? t(
              "orderPhotos.errors.sourceTooLarge",
              {
                name:
                  invalid.name,
              }
            )
          : t(
              "orderPhotos.errors.type"
            )
      );

      return;
    }

    setErrorMessage(
      null
    );

    setSelectedFiles(
      files
    );
  };

  const uploadFiles =
    async (): Promise<void> => {
      if (
        selectedFiles.length ===
        0
      ) {
        setErrorMessage(
          t(
            "orderPhotos.errors.filesRequired"
          )
        );

        return;
      }

      try {
        setUploading(true);
        setErrorMessage(
          null
        );
        setSuccessMessage(
          null
        );

        for (
          let index = 0;
          index <
          selectedFiles.length;
          index += 1
        ) {
          const source =
            selectedFiles[
              index
            ];

          setUploadProgress(
            t(
              "orderPhotos.upload.progress",
              {
                current:
                  index + 1,
                total:
                  selectedFiles.length,
                name:
                  source.name,
              }
            )
          );

          let prepared;

          try {
            prepared =
              await prepareOrderPhoto(
                source
              );
          } catch (
            error: unknown
          ) {
            const code =
              error instanceof
              Error
                ? error.message
                : "";

            if (
              code ===
              "IMAGE_SOURCE_TOO_LARGE" ||
              code ===
              "IMAGE_COMPRESSED_TOO_LARGE"
            ) {
              throw new Error(
                t(
                  "orderPhotos.errors.sourceTooLarge",
                  {
                    name:
                      source.name,
                  }
                )
              );
            }

            if (
              code ===
              "IMAGE_TYPE_UNSUPPORTED"
            ) {
              throw new Error(
                t(
                  "orderPhotos.errors.type"
                )
              );
            }

            throw new Error(
              t(
                "orderPhotos.errors.prepare",
                {
                  name:
                    source.name,
                }
              )
            );
          }

          await uploadOrderPhoto(
            orderId,
            prepared.file,
            {
              category,
              caption:
                caption.trim() ||
                null,

              originalName:
                source.name,

              width:
                prepared.width,

              height:
                prepared.height,
            }
          );
        }

        setSuccessMessage(
          t(
            "orderPhotos.success.uploaded",
            {
              count:
                selectedFiles.length,
            }
          )
        );

        setUploadOpen(
          false
        );

        setSelectedFiles(
          []
        );

        setCaption("");
        setCategory(
          "before"
        );

        setUploadProgress(
          ""
        );

        await loadPhotos();
      } catch (
        error: unknown
      ) {
        console.error(
          "Order photo upload failed:",
          error
        );

        setErrorMessage(
          error instanceof
            Error &&
          !(
            error as unknown as {
              response?: unknown;
            }
          ).response
            ? error.message
            : getErrorMessage(
                error,
                "upload"
              )
        );
      } finally {
        setUploading(
          false
        );
      }
    };

  const removePhoto =
    async (
      photo:
        OrderPhoto
    ): Promise<void> => {
      if (
        !isAdmin ||
        !window.confirm(
          t(
            "orderPhotos.deleteConfirmation"
          )
        )
      ) {
        return;
      }

      try {
        setDeletingId(
          photo.id
        );

        setErrorMessage(
          null
        );

        setSuccessMessage(
          null
        );

        await deleteOrderPhoto(
          orderId,
          photo.id
        );

        setSuccessMessage(
          t(
            "orderPhotos.success.deleted"
          )
        );

        await loadPhotos();
      } catch (
        error: unknown
      ) {
        console.error(
          "Order photo delete failed:",
          error
        );

        setErrorMessage(
          getErrorMessage(
            error,
            "delete"
          )
        );
      } finally {
        setDeletingId(
          null
        );
      }
    };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            alignItems={{
              sm: "center",
            }}
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <GalleryIcon
                color="primary"
              />

              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                >
                  {t(
                    "orderPhotos.title"
                  )}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {t(
                    "orderPhotos.subtitle"
                  )}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={
                <AddPhotoIcon />
              }
              onClick={() => {
                setUploadOpen(
                  true
                );

                setErrorMessage(
                  null
                );

                setSuccessMessage(
                  null
                );
              }}
            >
              {t(
                "orderPhotos.actions.add"
              )}
            </Button>
          </Stack>

          <Divider />

          {errorMessage && (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMessage(
                  null
                );
              }}
            >
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMessage(
                  null
                );
              }}
            >
              {successMessage}
            </Alert>
          )}

          {loading ? (
            <Stack
              alignItems="center"
              sx={{
                py: 4,
              }}
            >
              <CircularProgress />
            </Stack>
          ) : photos.length ===
            0 ? (
            <Typography
              color="text.secondary"
              sx={{
                py: 3,
                textAlign:
                  "center",
              }}
            >
              {t(
                "orderPhotos.empty"
              )}
            </Typography>
          ) : (
            <Stack spacing={3}>
              {categories.map(
                (
                  itemCategory
                ) => {
                  const categoryPhotos =
                    groupedPhotos[
                      itemCategory
                    ];

                  if (
                    categoryPhotos.length ===
                    0
                  ) {
                    return null;
                  }

                  return (
                    <Box
                      key={
                        itemCategory
                      }
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={
                            700
                          }
                        >
                          {t(
                            categoryKeys[
                              itemCategory
                            ]
                          )}
                        </Typography>

                        <Chip
                          size="small"
                          label={
                            categoryPhotos.length
                          }
                        />
                      </Stack>

                      <Box
                        sx={{
                          display:
                            "grid",

                          gridTemplateColumns:
                            {
                              xs:
                                "1fr",
                              sm:
                                "repeat(2, minmax(0, 1fr))",
                              md:
                                "repeat(3, minmax(0, 1fr))",
                              lg:
                                "repeat(4, minmax(0, 1fr))",
                            },

                          gap: 2,
                        }}
                      >
                        {categoryPhotos.map(
                          (
                            photo
                          ) => (
                            <Card
                              key={
                                photo.id
                              }
                              variant="outlined"
                            >
                              <CardMedia
                                component="img"
                                image={
                                  photo.signedUrl
                                }
                                alt={
                                  photo.caption ??
                                  photo.originalName
                                }
                                onClick={() => {
                                  setPreviewPhoto(
                                    photo
                                  );
                                }}
                                sx={{
                                  height:
                                    180,
                                  objectFit:
                                    "cover",
                                  cursor:
                                    "zoom-in",
                                  bgcolor:
                                    "action.hover",
                                }}
                              />

                              <CardContent
                                sx={{
                                  pb: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight={
                                    700
                                  }
                                  sx={{
                                    minHeight:
                                      20,
                                  }}
                                >
                                  {photo.caption ??
                                    t(
                                      "orderPhotos.noCaption"
                                    )}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  sx={{
                                    mt: 0.75,
                                  }}
                                >
                                  {formatDateTime(
                                    photo.createdAt
                                  )}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  {photo
                                    .uploadedByUser
                                    ?.name ??
                                    t(
                                      "common.notAvailable"
                                    )}
                                  {" · "}
                                  {formatMegabytes(
                                    photo.fileSize
                                  )}
                                </Typography>
                              </CardContent>

                              {isAdmin && (
                                <CardActions>
                                  <Button
                                    size="small"
                                    color="error"
                                    startIcon={
                                      deletingId ===
                                      photo.id ? (
                                        <CircularProgress
                                          size={
                                            16
                                          }
                                        />
                                      ) : (
                                        <DeleteIcon />
                                      )
                                    }
                                    disabled={
                                      deletingId !==
                                      null
                                    }
                                    onClick={() => {
                                      void removePhoto(
                                        photo
                                      );
                                    }}
                                  >
                                    {t(
                                      "orderPhotos.actions.delete"
                                    )}
                                  </Button>
                                </CardActions>
                              )}
                            </Card>
                          )
                        )}
                      </Box>
                    </Box>
                  );
                }
              )}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Dialog
        open={uploadOpen}
        onClose={closeUpload}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t(
            "orderPhotos.upload.title"
          )}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              pt: 1,
            }}
          >
            {errorMessage && (
              <Alert severity="error">
                {errorMessage}
              </Alert>
            )}

            <FormControl
              fullWidth
            >
              <InputLabel id="order-photo-category-label">
                {t(
                  "orderPhotos.upload.category"
                )}
              </InputLabel>

              <Select
                labelId="order-photo-category-label"
                label={t(
                  "orderPhotos.upload.category"
                )}
                value={category}
                onChange={(
                  event
                ) => {
                  setCategory(
                    event.target
                      .value as
                      OrderPhotoCategory
                  );
                }}
              >
                {categories.map(
                  (
                    itemCategory
                  ) => (
                    <MenuItem
                      key={
                        itemCategory
                      }
                      value={
                        itemCategory
                      }
                    >
                      {t(
                        categoryKeys[
                          itemCategory
                        ]
                      )}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <TextField
              label={t(
                "orderPhotos.upload.caption"
              )}
              value={caption}
              onChange={(
                event
              ) => {
                setCaption(
                  event.target
                    .value
                );
              }}
              helperText={`${caption.length}/500`}
              slotProps={{
                htmlInput: {
                  maxLength:
                    500,
                },
              }}
              multiline
              minRows={2}
              fullWidth
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
            >
              <Button
                component="label"
                variant="outlined"
                startIcon={
                  <GalleryIcon />
                }
                disabled={
                  uploading
                }
              >
                {t(
                  "orderPhotos.upload.choose"
                )}

                <input
                  hidden
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={
                    selectFiles
                  }
                />
              </Button>

              <Button
                component="label"
                variant="outlined"
                startIcon={
                  <CameraIcon />
                }
                disabled={
                  uploading
                }
              >
                {t(
                  "orderPhotos.upload.camera"
                )}

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={
                    selectFiles
                  }
                />
              </Button>
            </Stack>

            <Alert severity="info">
              {t(
                "orderPhotos.upload.hint"
              )}
            </Alert>

            {selectedFiles.length >
              0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                >
                  {t(
                    "orderPhotos.upload.selected",
                    {
                      count:
                        selectedFiles.length,
                    }
                  )}
                </Typography>

                <Stack spacing={0.5}>
                  {selectedFiles.map(
                    (
                      file
                    ) => (
                      <Typography
                        key={`${file.name}-${file.lastModified}`}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflowWrap:
                            "anywhere",
                        }}
                      >
                        {file.name}
                        {" · "}
                        {formatMegabytes(
                          file.size
                        )}
                      </Typography>
                    )
                  )}
                </Stack>
              </Paper>
            )}

            {uploadProgress && (
              <Alert
                severity="info"
                icon={
                  <CircularProgress
                    size={18}
                  />
                }
              >
                {uploadProgress}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeUpload}
            disabled={uploading}
          >
            {t(
              "orderPhotos.actions.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              void uploadFiles();
            }}
            disabled={
              uploading ||
              selectedFiles.length ===
                0
            }
          >
            {t(
              uploading
                ? "orderPhotos.actions.uploading"
                : "orderPhotos.actions.upload"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(
          previewPhoto
        )}
        onClose={() => {
          setPreviewPhoto(
            null
          );
        }}
        maxWidth="lg"
        fullWidth
      >
        {previewPhoto && (
          <>
            <DialogTitle>
              {previewPhoto.caption ??
                t(
                  categoryKeys[
                    previewPhoto
                      .category
                  ]
                )}
            </DialogTitle>

            <DialogContent
              sx={{
                p: 0,
                bgcolor:
                  "common.black",
              }}
            >
              <Box
                component="img"
                src={
                  previewPhoto
                    .signedUrl
                }
                alt={
                  previewPhoto.caption ??
                  previewPhoto.originalName
                }
                sx={{
                  display:
                    "block",
                  width:
                    "100%",
                  maxHeight:
                    "78vh",
                  objectFit:
                    "contain",
                }}
              />
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => {
                  setPreviewPhoto(
                    null
                  );
                }}
              >
                {t(
                  "orderPhotos.actions.close"
                )}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default OrderPhotosSection;
