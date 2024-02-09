const prisma = require("../models/prisma");
const relationshipService = require("../services/relationship-service");

const userFilter = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  mobile: true,
  profileImage: true,
  coverImage: true,
  createdAt: true,
  updatedAt: true,
};

exports.createPost = (data) => prisma.post.create({ data });
exports.findPostIncludeFriendPostByUsersId = async (userId) => {
  const friendsId = await relationshipService.findFriendsIdByUserId(userId);
  //   SELECT * FROM posts WHERE userId = userId OR userId IN [] ORDER BY created_at
  const posts = await prisma.post.findMany({
    where: {
      userId: {
        in: [userId, ...friendsId],
      },
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: userFilter },
      likes: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
  return posts;
};

exports.increaseLike = (postId) =>
  prisma.post.update({
    where: { id: postId },
    data: { totalLike: { increment: 1 } },
  });
exports.decreaseLike = (postId) =>
  prisma.post.update({
    where: { id: postId },
    data: { totalLike: { decrement: 1 } },
  });
