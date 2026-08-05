// controllers/userController.js
import User from "../models/User.js";
import News from "../models/News.js"; // path আপনার project অনুযায়ী ঠিক করে নিন

const ROLE_PROGRESSION = ["reader", "writer", "admin"];

const DEMOTE_MAP = {
  admin: "writer",
  writer: "reader",
};

// ১. সকল ইউজার গেট করা (Pagination, Search, ও প্রতি ইউজারের Article Stats সহ)
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role && role !== "all") filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    // এই পেজের ইউজারদের জন্য একবারেই (batch) published article stats বের করা
    const userIds = users.map((u) => u._id);

    const statsAgg = await News.aggregate([
      { $match: { author: { $in: userIds }, status: "published" } },
      {
        $group: {
          _id: "$author",
          postsCount: { $sum: 1 },
          viewsCount: { $sum: { $ifNull: ["$views", 0] } },
        },
      },
    ]);

    const statsMap = new Map(statsAgg.map((s) => [s._id.toString(), s]));

    const usersWithStats = users.map((u) => {
      const s = statsMap.get(u._id.toString());
      return {
        ...u.toObject(),
        stats: {
          postsCount: s?.postsCount ?? 0,
          viewsCount: s?.viewsCount ?? 0,
        },
      };
    });

    res.status(200).json({
      success: true,
      data: usersWithStats,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "ইউজার লোড করতে সমস্যা হয়েছে।",
    });
  }
};

// ২. একজন নির্দিষ্ট ইউজারের প্রোফাইল ডিটেইলস + published article stats (Hover Card / Profile View এর জন্য)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

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
      message: error.message || "ইউজারের তথ্য লোড করা যায়নি।",
    });
  }
};

// ৩. ইউজারকে পরবর্তী লেভেলের Role-এ Promote করা (reader -> writer -> admin)
export const promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentIndex = ROLE_PROGRESSION.indexOf(user.role);

    if (currentIndex === -1 || currentIndex === ROLE_PROGRESSION.length - 1) {
      return res.status(400).json({
        success: false,
        message: "এই ইউজার ইতিমধ্যে সর্বোচ্চ role-এ আছে।",
      });
    }

    user.role = ROLE_PROGRESSION[currentIndex + 1];
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "প্রমোট করা যায়নি।",
    });
  }
};

// ৪. ইউজারকে নিচের লেভেলের Role-এ Demote করা (admin -> writer -> reader)
export const demoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Super admin কে demote করা যাবে না।",
      });
    }

    const prevRole = DEMOTE_MAP[user.role];
    if (!prevRole) {
      return res.status(400).json({
        success: false,
        message: "এই ইউজারকে demote করার মতো নিচে কোনো role নেই।",
      });
    }

    user.role = prevRole;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Demote করা যায়নি।",
    });
  }
};

// ৫. ইউজার ডিলিট করা (Superadmin কে ডিলিট করা যাবে না)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Super admin কে delete করা যাবে না।",
      });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৬. Top Writers (Dashboard Widget - stats.totalViews অনুযায়ী sort করা)
export const getTopWriters = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const writers = await User.find({
      role: "writer",
      isActive: true,
    })
      .select("name username avatar stats.totalViews stats.postsCount")
      .sort({ "stats.totalViews": -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: writers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Top writers লোড করা যায়নি।",
    });
  }
};