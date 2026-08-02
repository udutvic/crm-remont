const express = require(
  "express"
);

const inventoryController =
  require(
    "../controllers/inventoryController"
  );

const inventoryImportController =
  require(
    "../controllers/inventoryImportController"
  );

const requireRole = require(
  "../middleware/requireRole"
);

const router =
  express.Router();

router.post(
  "/import/preview",
  requireRole(
    "admin"
  ),
  inventoryImportController
    .preview
);

router.post(
  "/import/execute",
  requireRole(
    "admin"
  ),
  inventoryImportController
    .execute
);

router.get(
  "/summary",
  inventoryController
    .getSummary
);

router.get(
  "/items",
  inventoryController
    .getItems
);

router.get(
  "/items/:id",
  inventoryController
    .getItem
);

router.get(
  "/items/:id/movements",
  inventoryController
    .getMovements
);

router.post(
  "/items",
  requireRole(
    "admin"
  ),
  inventoryController
    .createItem
);

router.patch(
  "/items/:id",
  requireRole(
    "admin"
  ),
  inventoryController
    .updateItem
);

router.post(
  "/items/:id/movements",
  inventoryController
    .createMovement
);

module.exports =
  router;
