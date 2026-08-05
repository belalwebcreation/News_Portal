import User from "../models/User.js";
import News from "../models/News.js";

// পাবলিক প্রোফাইল — যে কেউ (লগইন ছাড়াও) username দিয়ে দেখতে পারবে।
// শুধু পাবলিক-সেফ ফিল্ড সিলেক্ট করা হয়েছে, email/password কখনোই না।
export const getPublicProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select(
  "name username avatar coverPhoto bio phone address college occupation isVerified website role createdAt"
);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const [stats] = await News.aggregate([
      { $match: { author: user._id, status: "published" } },
      {
        $group: {
          _id: null,
          postsCount: { $sum: 1 },
          viewsCount: { $sum: { $ifNull: ["$views", 0] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        stats: {
          postsCount: stats?.postsCount ?? 0,
          viewsCount: stats?.viewsCount ?? 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "প্রোফাইল লোড করা যায়নি।",
    });
  }
};