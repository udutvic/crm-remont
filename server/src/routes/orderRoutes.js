const express = require("express");

const orderController = require("../controllers/orderController");

const router = express.Router();

router.get("/search", orderController.searchOrders);

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrder);

router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.patch("/:id", orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;