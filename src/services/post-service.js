const prisma = require("../models/prisma");

exports.createPost = (data) => prisma.post.create({ data });
