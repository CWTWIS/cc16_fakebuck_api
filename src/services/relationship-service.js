const { RELATIONSHIP_STATUS } = require("../constant");
const prisma = require("../models/prisma");

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

//   exports.findPendingRelationshipBySenderIdAndReceiverId =
