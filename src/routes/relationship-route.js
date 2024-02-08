const express = require("express");
const relationshipController = require("../controllers/relationship-controller");
const router = express.Router();

const subRouter = express.Router();

router.use("/users/:targetUserId", subRouter);

subRouter.post("/", relationshipController.requestFriend);
subRouter.patch("/confirm", relationshipController.confirmRequest);
subRouter.patch("/reject", relationshipController.rejectRequest);
subRouter.patch("/cancel", relationshipController.cancelRequest);
subRouter.patch("/unfriend", relationshipController.unfriend);

module.exports = router;
