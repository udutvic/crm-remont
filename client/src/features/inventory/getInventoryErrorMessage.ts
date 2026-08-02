import axios from "axios";
import type {
  TFunction,
} from "i18next";

interface InventoryErrorResponse {
  code?: string;
  error?: string;
}

const codeKeys:
  Record<string, string> = {
    INVENTORY_VALIDATION_FAILED:
      "inventoryPage.apiErrors.validation",
    INVENTORY_INVALID_FILTER:
      "inventoryPage.apiErrors.filter",
    INVENTORY_INVALID_ID:
      "inventoryPage.apiErrors.invalidId",
    INVENTORY_NOT_FOUND:
      "inventoryPage.apiErrors.notFound",
    INVENTORY_SKU_EXISTS:
      "inventoryPage.apiErrors.skuExists",
    INVENTORY_SUPPLIER_SKU_EXISTS:
      "inventoryPage.apiErrors.supplierSkuExists",
    INVENTORY_BARCODE_EXISTS:
      "inventoryPage.apiErrors.barcodeExists",
    INVENTORY_DUPLICATE:
      "inventoryPage.apiErrors.duplicate",
    INVENTORY_DIRECT_QUANTITY_FORBIDDEN:
      "inventoryPage.apiErrors.directQuantity",
    INVENTORY_EMPTY_UPDATE:
      "inventoryPage.apiErrors.emptyUpdate",
    INVENTORY_ITEM_INACTIVE:
      "inventoryPage.apiErrors.inactive",
    INVENTORY_ORDER_NOT_FOUND:
      "inventoryPage.apiErrors.orderNotFound",
    INVENTORY_INSUFFICIENT_STOCK:
      "inventoryPage.apiErrors.stock",
    INVENTORY_RETURN_EXCEEDS_ISSUED:
      "orderParts.errors.returnExceeds",
    INVENTORY_IMPORT_ROWS_REQUIRED:
      "inventoryPage.import.errors.rowsRequired",
    INVENTORY_IMPORT_TOO_LARGE:
      "inventoryPage.import.errors.tooLarge",
    INVENTORY_IMPORT_INVALID_ACTION:
      "inventoryPage.import.errors.invalidAction",
    INVENTORY_IMPORT_INVALID_STRATEGY:
      "inventoryPage.import.errors.invalidStrategy",
    INVENTORY_IMPORT_BLOCKED:
      "inventoryPage.import.errors.blocked",
    INVENTORY_IMPORT_CONFLICT:
      "inventoryPage.import.errors.conflict",
    INVENTORY_IMPORT_INTERNAL_ERROR:
      "inventoryPage.import.errors.server",
    INVENTORY_INTERNAL_ERROR:
      "inventoryPage.apiErrors.server",
    AUTH_FORBIDDEN:
      "inventoryPage.apiErrors.forbidden",
    AUTH_REQUIRED:
      "inventoryPage.apiErrors.auth",
  };

const getInventoryErrorMessage = (
  error: unknown,
  t: TFunction,
  fallback:
    | "loadFailed"
    | "saveFailed"
    | "movementFailed"
    | "historyFailed"
    | "ordersFailed"
    | "previewFailed"
    | "importFailed"
): string => {
  if (
    axios.isAxiosError<
      InventoryErrorResponse
    >(error)
  ) {
    const code =
      error.response
        ?.data?.code;

    if (
      code &&
      codeKeys[code]
    ) {
      return t(
        codeKeys[code]
      );
    }

    if (
      error.response
        ?.status === 403
    ) {
      return t(
        "inventoryPage.apiErrors.forbidden"
      );
    }
  }

  return t(
    `inventoryPage.errors.${fallback}`
  );
};

export default getInventoryErrorMessage;
