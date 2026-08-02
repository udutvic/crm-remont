const express = require(
  "express"
);

const intakeController =
  require(
    "../controllers/intakeController"
  );

const router = express.Router();

router.post(
  "/",
  intakeController.createIntake
);

module.exports = router;
