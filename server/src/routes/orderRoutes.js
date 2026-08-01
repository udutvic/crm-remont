const express = require("express");

const orderController =
  require(
    "../controllers/orderController"
  );

const orderListController =
  require(
    "../controllers/orderListController"
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
  orderController.deleteOrder
);

module.exports = router;