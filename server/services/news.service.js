import News from "../models/News.js";
import mongoose from "mongoose";

/**
 * @desc    Create new news article
 */
export const createNewsService = async (newsData, authorId) => {
  const newNews = await News.create({
    ...newsData,
    author: authorId,
  });

  return await newNews.populate([
    { path: "author", select: "name email avatar" },
    { path: "category", select: "name slug" },
    { path: "thumbnail.media", select: "url caption" },
  ]);
};

/**
 * @desc    Get all news with Pagination, Search, and Category Filtering
 */
export const getAllNewsService = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Query Filters Building
  const filter = {};

  // 1. Status Filter (Default: 'published' public-এর জন্য, admin চাইলে সব দেখতে পাবে)
  if (query.status) {
    filter.status = query.status;
  } else {
    filter.status = "published";
  }

  // 2. Category Filter
  if (query.category) {
    filter.category = query.category;
  }

  // 3. Author Filter
  if (query.author) {
    filter.author = query.author;
  }

  // 4. Search Filter (Title or Summary)
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { summary: { $regex: query.search, $options: "i" } },
    ];
  }

  // Execute Queries in Parallel for Maximum Performance
  const [newsList, totalDocs] = await Promise.all([
    News.find(filter)
      .populate("author", "name email avatar")
      .populate("category", "name slug")
      .populate("thumbnail.media", "url caption")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(), // lean() ব্যবহার করা হয়েছে FAST Response পাওয়ার জন্য
    News.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return {
    meta: {
      totalDocs,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: newsList,
  };
};

/**
 * @desc    Get single news by ID or Slug
 */
export const getSingleNewsService = async (identifier) => {
  // Check if identifier is ObjectId or Slug
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };

  const article = await News.findOne(query)
    .populate("author", "name email avatar bio")
    .populate("category", "name slug")
    .populate("thumbnail.media", "url caption");

  return article;
};

/**
 * @desc    Update news article by ID
 */
export const updateNewsService = async (id, updateData, updatedByUserId) => {
  const updatedArticle = await News.findByIdAndUpdate(
    id,
    {
      ...updateData,
      updatedBy: updatedByUserId,
    },
    { new: true, runValidators: true }
  ).populate([
    { path: "author", select: "name email" },
    { path: "category", select: "name slug" },
    { path: "thumbnail.media", select: "url caption" },
  ]);

  return updatedArticle;
};

/**
 * @desc    Delete news article by ID
 */
export const deleteNewsService = async (id) => {
  const deletedArticle = await News.findByIdAndDelete(id);
  return deletedArticle;
};