const express = require("express");
const relationshipController = require("../controllers/relationship-controller");
const router = express.Router();

router.post("/users/:targetUserId", relationshipController.requestFriend);
router.patch(
  "/users/:targetUserId/confirm",
  relationshipController.confirmRequest
);
router.patch(
  "/users/:targetUserId/reject",
  relationshipController.rejectRequest
);
router.patch(
  "/users/:targetUserId/cancel",
  relationshipController.cancelRequest
);
router.patch("/users/:targetUserId/unfriend", relationshipController.unfriend);

module.exports = router;
