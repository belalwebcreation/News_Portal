import mongoose from "mongoose";
import Category from "../models/categoryModel.js";
// ১) সাইট সেটিংস মডেল ইমপোর্ট করা হলো ডাটা ক্লিনআপের জন্য
import SiteSetting from "../models/SiteSetting.js";

const NEWS_COLLECTION = process.env.NEWS_COLLECTION || "news";

const categoryProjection = {
  _id: 1,
  name: 1,
  slug: 1,
  description: 1,
  isActive: 1,
  position: 1,
  createdAt: 1,
  updatedAt: 1,
};

const ensureValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("ক্যাটাগরি আইডি সঠিক নয়।");
    error.statusCode = 400;
    throw error;
  }
};

const countNews = (categoryId) =>
  mongoose.connection.collection(NEWS_COLLECTION).countDocuments({
    category: new mongoose.Types.ObjectId(categoryId),
  });

const toCategoryDto = (category, newsCount = 0) => {
  const document = category.toObject ? category.toObject() : category;

  return {
    ...document,
    newsCount,
  };
};

// =========================
// GET ALL
// =========================

export async function listCategories(req, res) {
  const categories = await Category.aggregate([
    {
      $sort: {
        position: 1,
        name: 1,
      },
    },
    {
      $lookup: {
        from: NEWS_COLLECTION,
        let: {
          categoryId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$category", "$$categoryId"],
              },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "newsStats",
      },
    },
    {
      $set: {
        newsCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$newsStats.count", 0],
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        ...categoryProjection,
        newsCount: 1,
      },
    },
  ]);

  return res.json({
    success: true,
    data: categories,
  });
}

// =========================
// CREATE
// =========================

export async function createCategory(req, res) {
  const category = await Category.create(req.validatedBody);

  return res.status(201).json({
    success: true,
    data: toCategoryDto(category),
  });
}

// =========================
// UPDATE
// =========================

export async function updateCategory(req, res) {
  ensureValidId(req.params.id);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.validatedBody,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    const error = new Error("ক্যাটাগরিটি পাওয়া যায়নি।");
    error.statusCode = 404;
    throw error;
  }

  const newsCount = await countNews(category._id);

  return res.json({
    success: true,
    data: toCategoryDto(category, newsCount),
  });
}

// =========================
// DELETE
// =========================

export async function deleteCategory(req, res) {
  ensureValidId(req.params.id);

  const category = await Category.findById(req.params.id).select("_id name");

  if (!category) {
    const error = new Error("ক্যাটাগরিটি পাওয়া যায়নি।");
    error.statusCode = 404;
    throw error;
  }

  const newsCount = await countNews(category._id);

  if (newsCount > 0) {
    const error = new Error(
      `“${category.name}” ক্যাটাগরিতে ${newsCount}টি নিউজ আছে। আগে নিউজগুলো অন্য ক্যাটাগরিতে সরান।`
    );
    error.statusCode = 409;
    throw error;
  }

  // ২) ডিলিট করার ঠিক আগে Navbar থেকে ডিলিটেড ক্যাটাগরির রেফারেন্স $pull করা হলো
  await SiteSetting.updateOne(
    {},
    {
      $pull: {
        navbar: {
          category: category._id,
        },
      },
    }
  );

  await category.deleteOne();

  return res.status(200).json({
    success: true,
    message: "ক্যাটাগরি সফলভাবে ডিলিট হয়েছে।",
  });
}