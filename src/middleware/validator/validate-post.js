const createError = require("../../utils/create-error");

exports.validateCreatePost = (req, res, next) => {
  const { title } = req.body;
  const { file } = req;
  if ((!title || !title.trim()) && !file) {
    createError("at least onr of title or image is required");
  }
  next();
};
