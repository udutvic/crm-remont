const express = require("express");

const orderController =
  require(
    "../controllers/orderController"
  );

const orderFinanceController =
  require(
    "../controllers/orderFinanceController"
  );

const orderPhotoController =
  require(
    "../controllers/orderPhotoController"
  );

const orderListController =
  require(
    "../controllers/orderListController"
  );

const requireRole = require(
  "../middleware/requireRole"
);

const orderPhotoUpload =
  require(
    "../middleware/orderPhotoUpload"
  );

const {
  auditSensitiveAccess,
} = require(
  "../middleware/auditRequest"
);

const router = express.Router();

router.get(
  "/paged",
  orderListController.getPagedOrders
);

router.get(
  "/search",
  orderController.searchOrders
);

router.get(
  "/",
  orderController.getAllOrders
);

router.get(
  "/:id/photos",
  orderPhotoController
    .listPhotos
);

router.post(
  "/:id/photos",
  orderPhotoUpload,
  orderPhotoController
    .uploadPhoto
);

router.delete(
  "/:id/photos/:photoId",
  requireRole("admin"),
  orderPhotoController
    .deletePhoto
);

router.get(
  "/:id/finance",
  orderFinanceController
    .getFinance
);

router.patch(
  "/:id/finance",
  requireRole(
    "admin"
  ),
  orderFinanceController
    .updateFinance
);

router.get(
  "/:id/access-code",
  auditSensitiveAccess({
    action:
      "ORDER_ACCESS_CODE_REVEAL",
    entityType: "order",
  }),
  orderController.revealAccessCode
);

router.get(
  "/:id",
  orderController.getOrder
);

router.post(
  "/",
  orderController.createOrder
);

router.put(
  "/:id",
  orderController.updateOrder
);

router.patch(
  "/:id/status",
  orderController.updateOrderStatus
);

router.patch(
  "/:id/deliver",
  orderController.markOrderDelivered
);

/*
 * Temporary compatibility route
 * for the current frontend.
 */
router.patch(
  "/:id",
  orderController.updateOrderStatus
);

router.patch(
  "/:id/archive",
  requireRole("admin"),
  orderController.archiveOrder
);

router.patch(
  "/:id/restore",
  requireRole("admin"),
  orderController.restoreOrder
);

module.exports = router;