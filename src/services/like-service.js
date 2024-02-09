const prisma = require("../models/prisma");

exports.findLikeByUserIdAndPostId = (userId, postId) =>
  prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });

exports.createLike = (data) => prisma.like.create({ data });
exports.updateLike = (deletedAt, userId, postId) =>
  prisma.like.update({
    data: { deletedAt },
    where: { userId_postId: { userId, postId } },
  });
