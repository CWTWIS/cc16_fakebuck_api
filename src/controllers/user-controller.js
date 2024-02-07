const catchError = require("../utils/catch-error");
const createError = require("../utils/create-error");
const userService = require("../services/user-service");

exports.updateUser = catchError(async (req, res, next) => {
  if (!req.files) {
    createError("profile image or cover image is required", 400);
  }
  await userService.updateUserById(
    {
      profileImage: req.files.profileImage?.[0].path,
      coverImage: req.files.coverImage?.[0].path,
    },
    req.user.id
  );
  res.status(200).json({ message: "success" });
});
