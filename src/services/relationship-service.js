const {
  RELATIONSHIP_STATUS,
  RELATIONSHIP_TO_AUTH_USER,
} = require("../constant");
const prisma = require("../models/prisma");

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

exports.createRelationship = (senderId, receiverId) =>
  // senderId != receiverId
  //check status??
  prisma.relationship.create({ data: { senderId, receiverId } });

//   SELECT * FROM relationships WHERE
// ((sender_id = userId1 AND receiver_id = userId2) OR (sender_id = userId2 AND receiver_id = userId1))
// AND (status = PENDING OR status = FRIEND)
exports.checkExistRelationshipBetweenTwoUser = (userId1, userId2) =>
  prisma.relationship.findFirst({
    where: {
      AND: [
        {
          OR: [
            { status: RELATIONSHIP_STATUS.PENDING },
            { status: RELATIONSHIP_STATUS.ACCEPTED },
          ],
        },
        {
          OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
          ],
        },
      ],
    },
  });

exports.findRelationship = (where) => prisma.relationship.findFirst({ where });

exports.updateRelationship = (data, id) =>
  prisma.relationship.update({ data, where: { id } });

exports.findFriendByUserId = async (userId) => {
  // SELECT * FROM relationship WHERE
  // (status = ACCEPTED) AND (senderId = userId OR receiverId = userId)
  const relationships = await prisma.relationship.findMany({
    where: {
      status: RELATIONSHIP_STATUS.ACCEPTED,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    select: {
      sender: { select: userFilter },
      receiver: { select: userFilter },
    },
  });
  //    2       5            4      2         2       1
  // [{sender,receiver}, {sender,receiver}, {sender,receiver}] //1 obj = 1 friend
  //  transform ===> [{id: 5}, {id: 4}, {id: 1}]
  const friends = relationships.map((el) =>
    el.sender.id === userId ? el.receiver : el.sender
  );
  return friends;
};

//                                            5       3
exports.findUserOneRelationshipToUserTwo = async (userId1, userId2) => {
  if (userId1 === userId2) {
    return RELATIONSHIP_TO_AUTH_USER.ME;
  }
  // SELECT * FROM relationship WHERE (status = PENDING OR status = ACCEPTED) AND
  // (sender_id = userId1 AND receiver_id = userId2) OR (sender_id = userId2 AND receiver_id = userId1)
  const relationship = await prisma.relationship.findFirst({
    where: {
      AND: [
        {
          OR: [
            { status: RELATIONSHIP_STATUS.PENDING },
            { status: RELATIONSHIP_STATUS.ACCEPTED },
          ],
        },
        {
          OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
          ],
        },
      ],
    },
  });
  if (!relationship) {
    return RELATIONSHIP_TO_AUTH_USER.UNKNOWN;
  }
  if (relationship.status === RELATIONSHIP_STATUS.ACCEPTED) {
    return RELATIONSHIP_TO_AUTH_USER.FRIEND;
  }
  if (relationship.senderId === userId1) {
    return RELATIONSHIP_TO_AUTH_USER.SENDER;
  }
  return RELATIONSHIP_TO_AUTH_USER.RECEIVER;

  // const friendRelationship = await prisma.relationship.findFirst({
  //   where: {
  //     status: RELATIONSHIP_STATUS.ACCEPTED,
  //     OR: [
  //       { senderId: userId1, receiverId: userId2 },
  //       { senderId: userId2, receiverId: userId1 },
  //     ],
  //   },
  // });
};
