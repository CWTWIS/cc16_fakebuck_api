const catchError = require("../utils/catch-error");

exports.requestFriend = catchError(async (req, res, next) => {
  res.status(200).json(req.params);
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
