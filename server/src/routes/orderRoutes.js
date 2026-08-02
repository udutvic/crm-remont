const express = require("express");

const orderController =
  require(
    "../controllers/orderController"
  );

const orderListController =
  require(
    "../controllers/orderListController"
  );

const requireRole = require(
  "../middleware/requireRole"
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

router.delete(
  "/:id",
  requireRole("admin"),
  orderController.deleteOrder
);

module.exports = router;