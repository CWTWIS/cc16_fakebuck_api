const catchError = require("../utils/catch-error");
const relationshipService = require("../services/relationship-service");
const createError = require("../utils/create-error");
const { RELATIONSHIP_STATUS } = require("../constant");

exports.requestFriend = catchError(async (req, res, next) => {
  if (req.user.id === req.targetUserId) {
    createError("sender and receiver must not be the same person", 400);
  }
  const existRelationship =
    await relationshipService.checkExistRelationshipBetweenTwoUser(
      req.user.id,
      req.targetUserId
    );
  if (existRelationship) {
    createError("already have relationship", 400);
  }
  await relationshipService.createRelationship(req.user.id, req.targetUserId);
  res.status(200).json({ message: "success request" });
});

exports.confirmRequest = catchError(async (req, res, next) => {
  // SELECT * FROM relationship WHERE status = PENDING AND sender_id = targetUserId AND receiver_id = req.user.id
  const pendingRelationship = await relationshipService.findRelationship({
    status: RELATIONSHIP_STATUS.PENDING,
    senderId: req.targetUserId,
    receiverId: req.user.id,
  });

  if (!pendingRelationship) {
    createError("request does not exist", 400);
  }

  await relationshipService.updateRelationship(
    { status: RELATIONSHIP_STATUS.ACCEPTED },
    pendingRelationship.id
  );

  res.status(200).json({ message: "request accepted" });
});

exports.rejectRequest = catchError(async (req, res, next) => {
  const pendingRelationship = await relationshipService.findRelationship({
    status: RELATIONSHIP_STATUS.PENDING,
    senderId: req.targetUserId,
    receiverId: req.user.id,
  });
  if (!pendingRelationship) {
    createError("request does not exist", 400);
  }

  await relationshipService.updateRelationship(
    { status: RELATIONSHIP_STATUS.REJECTED },
    pendingRelationship.id
  );

  res.status(200).json({ message: "request rejected" });
});

exports.cancelRequest = catchError(async (req, res, next) => {
  const pendingRelationship = await relationshipService.findRelationship({
    status: RELATIONSHIP_STATUS.PENDING,
    senderId: req.user.id,
    receiverId: req.targetUserId,
  });
  if (!pendingRelationship) {
    createError("request does not exist", 400);
  }

  await relationshipService.updateRelationship(
    { status: RELATIONSHIP_STATUS.CANCELED },
    pendingRelationship.id
  );
  res.status(200).json({ message: "request canceled" });
});

exports.unfriend = catchError(async (req, res, next) => {
  // SELECT * FROM relationships WHERE
  // (sender = req.user.id AND receiver_id = req.targetUserId) OR (sender = req.targetUserId AND receiver_id = req.user.id)
  // AND status = ACCEPTED
  const friendRelationship = await relationshipService.findRelationship({
    status: RELATIONSHIP_STATUS.ACCEPTED,
    OR: [
      { senderId: req.user.id, receiverId: req.targetUserId },
      { senderId: req.targetUserId, receiverId: req.user.id },
    ],
  });
  if (!friendRelationship) {
    createError("this user is not your friend", 400);
  }

  await relationshipService.updateRelationship(
    { status: RELATIONSHIP_STATUS.UNFRIEND },
    friendRelationship.id
  );
  res.status(200).json({ message: "friendship terminated" });
});
