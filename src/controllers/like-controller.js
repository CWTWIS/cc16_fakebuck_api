const catchError = require("../utils/catch-error");
const likeService = require("../services/like-service");
const postService = require("../services/post-service");

exports.toggleLike = catchError(async (req, res, next) => {
  const userId = req.user.id;
  const postId = +req.params.postId;
  const like = await likeService.findLikeByUserIdAndPostId(userId, postId);
  if (!like) {
    const like = await likeService.createLike({ userId, postId });
    await postService.increaseLike(postId);
    return res.status(201).json({ message: "like created", like });
  }
  if (!like.deletedAt) {
    await likeService.updateLike(new Date(), userId, postId);
    await postService.decreaseLike(postId);
    return res.status(201).json({ message: "unliked" });
  }
  await likeService.updateLike(null, userId, postId);
  await postService.increaseLike(postId);
  return res.status(201).json({ message: "liked" });
});
