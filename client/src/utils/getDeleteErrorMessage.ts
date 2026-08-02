import axios from "axios";
import type {
  TFunction,
} from "i18next";

interface DeleteApiError {
  code?: string;
  error?: string;
}

const codeTranslationKeys:
  Record<string, string> = {
    CLIENT_DELETE_HAS_ORDERS:
      "deleteDialog.errors.clientHasOrders",

    CLIENT_DELETE_HAS_DEVICES:
      "deleteDialog.errors.clientHasDevices",

    DEVICE_DELETE_HAS_ORDERS:
      "deleteDialog.errors.deviceHasOrders",

    CLIENT_NOT_FOUND:
      "deleteDialog.errors.clientNotFound",

    DEVICE_NOT_FOUND:
      "deleteDialog.errors.deviceNotFound",

    ORDER_NOT_FOUND:
      "deleteDialog.errors.orderNotFound",

    INVALID_CLIENT_ID:
      "deleteDialog.errors.invalidClient",

    INVALID_DEVICE_ID:
      "deleteDialog.errors.invalidDevice",

    INVALID_ORDER_ID:
      "deleteDialog.errors.invalidOrder",
  };

const messageTranslationKeys:
  Record<string, string> = {
    "Cannot delete client because repair orders are associated with this client.":
      "deleteDialog.errors.clientHasOrders",

    "Cannot delete client because devices are associated with this client.":
      "deleteDialog.errors.clientHasDevices",

    "Cannot delete device because repair orders are associated with this device.":
      "deleteDialog.errors.deviceHasOrders",

    "Client not found.":
      "deleteDialog.errors.clientNotFound",

    "Device not found.":
      "deleteDialog.errors.deviceNotFound",

    "Order not found.":
      "deleteDialog.errors.orderNotFound",

    "Invalid client ID.":
      "deleteDialog.errors.invalidClient",

    "Invalid device ID.":
      "deleteDialog.errors.invalidDevice",

    "Invalid order ID.":
      "deleteDialog.errors.invalidOrder",

    "Internal server error.":
      "deleteDialog.errors.server",
  };

const getDeleteErrorMessage = (
  error: unknown,
  t: TFunction
): string => {
  if (
    !axios.isAxiosError<
      DeleteApiError
    >(error)
  ) {
    return t(
      "deleteDialog.errors.deleteFailed"
    );
  }

  const response =
    error.response;

  const code =
    response?.data?.code?.trim();

  if (
    code &&
    codeTranslationKeys[code]
  ) {
    return t(
      codeTranslationKeys[code]
    );
  }

  const serverMessage =
    response?.data?.error?.trim();

  if (
    serverMessage &&
    messageTranslationKeys[
      serverMessage
    ]
  ) {
    return t(
      messageTranslationKeys[
        serverMessage
      ]
    );
  }

  switch (
    response?.status
  ) {
    case 403:
      return t(
        "deleteDialog.errors.forbidden"
      );

    case 404:
      return t(
        "deleteDialog.errors.notFound"
      );

    case 409:
      return t(
        "deleteDialog.errors.conflict"
      );

    case 500:
      return t(
        "deleteDialog.errors.server"
      );

    default:
      return t(
        "deleteDialog.errors.deleteFailed"
      );
  }
};

export default getDeleteErrorMessage;
