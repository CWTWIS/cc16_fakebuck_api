const catchError = require("../utils/catch-error");
const uploadService = require("../services/upload-service");
const postService = require("../services/post-service");

exports.createPost = catchError(async (req, res, next) => {
  const data = { userId: req.user.id, title: req.body.title };
  // check id file existed => upload => url
  if (req.file) {
    data.image = await uploadService.upload(req.file.path);
  }
  const post = await postService.createPost(data);
  res.status(201).json({ post });
});
