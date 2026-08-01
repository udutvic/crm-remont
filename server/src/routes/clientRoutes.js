const express = require("express");

const clientController = require(
  "../controllers/clientController"
);

const requireRole = require(
  "../middleware/requireRole"
);

const router = express.Router();

router.get(
  "/lookup",
  clientController.lookupClientByPhone
);

router.get(
  "/search",
  clientController.searchClients
);

router.get(
  "/",
  clientController.getAllClients
);

router.get(
  "/:id",
  clientController.getClient
);

router.post(
  "/",
  clientController.createClient
);

router.put(
  "/:id",
  clientController.updateClient
);

router.delete(
  "/:id",
  requireRole("admin"),
  clientController.deleteClient
);

module.exports = router;