const express = require("express");

const deviceModelController = require(
  "../controllers/deviceModelController"
);

const router = express.Router();

router.get(
  "/",
  deviceModelController.listDeviceModels
);

router.post(
  "/",
  deviceModelController.createDeviceModel
);

module.exports = router;
