const express = require("express");
const postController = require("../controllers/post-controller");
const likeController = require("../controllers/like-controller");
const { validateCreatePost } = require("../middleware/validator/validate-post");
const upload = require("../middleware/upload");
const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  validateCreatePost,
  postController.createPost
);

router.get("/friends", postController.getAllPostIncludeFriendPosts);
router.post("/:postId/likes", likeController.toggleLike);

module.exports = router;
