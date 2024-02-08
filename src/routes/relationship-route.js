const express = require("express");

const userController = require("../controllers/user-controller");
const relationshipController = require("../controllers/relationship-controller");
const {
  validateTargetUserId,
} = require("../middleware/validator/validate-user");
const router = express.Router();

const subRouter = express.Router({ mergeParams: true });

router.use("/users/:targetUserId", subRouter);
subRouter.use(validateTargetUserId, userController.checkExistUser);

subRouter.post("/", relationshipController.requestFriend);
subRouter.patch("/confirm", relationshipController.confirmRequest);
subRouter.patch("/reject", relationshipController.rejectRequest);
subRouter.patch("/cancel", relationshipController.cancelRequest);
subRouter.patch("/unfriend", relationshipController.unfriend);

module.exports = router;
