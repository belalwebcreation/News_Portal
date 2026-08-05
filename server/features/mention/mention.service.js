import User from "../../models/User.js";

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


export const searchMentionUsersService = async (
  query,
  limit = 8
) => {

  const keyword = query?.trim();

  if (!keyword) {
    return [];
  }


  const safeLimit = Math.min(
    Math.max(Number(limit) || 8, 1),
    50
  );


  const escapedKeyword = escapeRegex(keyword);

  const regex = new RegExp(
    escapedKeyword,
    "i"
  );


  const users = await User.find({
    isActive: true,

    role: {
      $in: [
        "admin",
        "writer",
        "reader",
      ],
    },

    $or: [
      {
        username: regex,
      },
      {
        name: regex,
      },
    ],

  })
    .select({
      _id: 1,
      username: 1,
      name: 1,
      role: 1,
      avatar: 1,
    })

    .sort({
      name: 1,
    })

    .limit(safeLimit)

    .lean();


  return users;
};