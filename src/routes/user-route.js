const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();
const userController = require("../controllers/user-controller");
const {
  validateTargetUserId,
} = require("../middleware/validator/validate-user");

router.patch(
  "/",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController.updateUser
);

router.get(
  "/:targetUserId/profile",
  validateTargetUserId,
  userController.checkExistUser,
  userController.getUserProfileByUserId
);

module.exports = router;
