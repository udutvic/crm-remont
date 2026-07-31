const express = require("express");

const clientController = require(
  "../controllers/clientController"
);

const router = express.Router();

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
  clientController.deleteClient
);

module.exports = router;