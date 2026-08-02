const express = require(
  "express"
);

const staffController =
  require(
    "../controllers/staffController"
  );

const router =
  express.Router();

router.get(
  "/",
  staffController.getStaffUsers
);

router.post(
  "/",
  staffController.createStaffUser
);

router.patch(
  "/:id",
  staffController.updateStaffUser
);

router.put(
  "/:id/password",
  staffController.resetStaffPassword
);

router.post(
  "/:id/revoke-sessions",
  staffController.revokeStaffSessions
);

module.exports =
  router;
