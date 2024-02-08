const catchError = require("../utils/catch-error");
const relationshipService = require("../services/relationship-service");
const createError = require("../utils/create-error");

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
  res.status(200).json({ message: "confirmRequest" });
});
exports.rejectRequest = catchError(async (req, res, next) => {
  res.status(200).json({ message: "rejectRequest" });
});
exports.cancelRequest = catchError(async (req, res, next) => {
  res.status(200).json({ message: "cancelRequest" });
});
exports.unfriend = catchError(async (req, res, next) => {
  res.status(200).json({ message: "unfriend" });
});
