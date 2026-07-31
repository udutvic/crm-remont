const express = require("express");

const deviceController = require("../controllers/deviceController");

const router = express.Router();

router.get("/search", deviceController.searchDevices);

router.get("/", deviceController.getAllDevices);
router.get("/:id", deviceController.getDevice);

router.post("/", deviceController.createDevice);
router.put("/:id", deviceController.updateDevice);
router.delete("/:id", deviceController.deleteDevice);

module.exports = router;
