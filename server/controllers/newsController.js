import mongoose from 'mongoose'; // ✅ NEW — writer-stats aggregation এ ObjectId cast করার জন্য
import News from '../models/News.js';
import Media from '../models/mediaModel.js';
import Category from '../models/categoryModel.js';
import { generateSeoSlug } from '../utils/slugGenerator.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { extractYoutubeVideo } from '../utils/extractYoutubeVideo.js';
import { enforceVideoSectionLimit } from '../utils/enforceVideoSectionLimit.js'; // ✅ NEW

// ✅ NEW: author/updatedBy populate করার সময় সব controller-এ একই ফিল্ড-সেট
// ব্যবহার করার জন্য এখানে একবার define করা হলো — এখন থেকে avatar/username
// সবসময় সাথে আসবে, ভবিষ্যতে কোথাও ভুলে বাদ পড়বে না।
const AUTHOR_POPULATE = {
  select: 'name email role username avatar profileImage',
  populate: {
    path: 'profileImage',
    select: 'url alt width height',
  },
};

/**
 * @desc Upload image, save to Media collection, and return media info
 * @route POST /api/news/image
 */
export const uploadNewsImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, "news/content");

    const media = await Media.create({
      type: "image",
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      width: result.width || 0,
      height: result.height || 0,
      url: result.secure_url,
      cloudinaryPublicId: result.public_id,
      storageProvider: "cloudinary",
      uploadedBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      mediaId: media._id,
      url: media.url,
      secureUrl: media.url,
      cloudinaryPublicId: media.cloudinaryPublicId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create News
 * @route POST /api/news
 */
export const createNews = async (req, res, next) => {
  try {
    const {
      title,
      slug: providedSlug, // ✅ FIX: আগে destructure-ই করা হতো না, তাই
      // frontend থেকে পাঠানো manual/auto slug সবসময় silently ignore হয়ে যেত।
      summary,
      content,
      thumbnail,
      category,
      status,
      isFeatured,
      showInVideoSection, // ✅ NEW
    } = req.body;

    // ✅ FIX: client একটা non-empty slug পাঠালে সেটাকে normalize+unique করে
    // ব্যবহার করা হবে। খালি থাকলে (বা না পাঠালে) আগের মতোই title থেকে
    // auto-generate হবে — backward compatible।
    const slug = providedSlug?.trim()
      ? await generateSeoSlug(providedSlug.trim())
      : await generateSeoSlug(title);

    const mediaId = typeof thumbnail === 'string' ? thumbnail : thumbnail?.media;

    // ✅ NEW: checkbox true হলেও body-তে আসলে video না থাকলে videoMeta null-ই থাকবে,
    // আর flag নিজে থেকেই false হয়ে যাবে — এমপ্টি entry কখনো Video Section-এ যাবে না
    const videoMeta = showInVideoSection ? extractYoutubeVideo(content) : null;

    const news = await News.create({
      title,
      slug,
      summary,
      content,
      thumbnail: { media: mediaId || null },
      category,
      author: req.user._id,
      status: status || 'draft',
      isFeatured: isFeatured || false,
      showInVideoSection: Boolean(showInVideoSection) && Boolean(videoMeta),
      videoMeta,
    });

    // ✅ NEW: এই article video-flagged হলে ৩০-এর cap enforce করা —
    // সবচেয়ে পুরনো flagged article(গুলো) থেকে flag খুলে দেওয়া হবে প্রয়োজনে
    if (news.showInVideoSection) {
      await enforceVideoSectionLimit();
    }

    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update News
 * @route PUT /api/news/:id
 */
export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: providedSlug, // ✅ FIX: আগে এখানেও slug destructure হতো না,
      // তাই manual slug edit করলেও কখনো save হতো না।
      summary,
      content,
      thumbnail,
      category,
      status,
      isFeatured,
      showInVideoSection, // ✅ NEW
    } = req.body;

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found.' });
    }

    const isOwner = news.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this article.',
      });
    }

    const titleChanged = Boolean(title) && title !== news.title;

    if (titleChanged) {
      news.title = title;
    }

    // ✅ FIX: slug resolution logic —
    // ১) client একটা নতুন non-empty slug পাঠালে (পুরনোটার চেয়ে ভিন্ন হলে),
    //    সেটাই normalize করে ব্যবহার হবে — manual slug এখন honor হয়।
    // ২) client slug না পাঠালে কিন্তু title বদলেছে —
    //    আগের behavior অনুযায়ী title থেকে auto slug বানানো হবে।
    // ৩) কোনোটাই না হলে পুরনো slug অক্ষত থাকবে।
    if (providedSlug?.trim() && providedSlug.trim() !== news.slug) {
      news.slug = await generateSeoSlug(providedSlug.trim());
    } else if (!providedSlug?.trim() && titleChanged) {
      news.slug = await generateSeoSlug(title);
    }

    if (summary !== undefined) news.summary = summary;
    if (content) news.content = content;

    if (thumbnail !== undefined) {
      const mediaId = typeof thumbnail === 'string' ? thumbnail : thumbnail?.media;
      news.thumbnail = { media: mediaId || null };
    }

    if (category) news.category = category;
        if (status) {
      const isPrivilegedUser =
        req.user.role === 'admin' || req.user.role === 'superadmin';

      if (status === 'published' && !isPrivilegedUser) {
        return res.status(403).json({
          success: false,
          message:
            'শুধু Admin বা Superadmin আর্টিকেল Publish করতে পারবে। এর বদলে Review-এর জন্য Submit করুন।',
        });
      }

      news.status = status;
    }
    if (isFeatured !== undefined) news.isFeatured = isFeatured;

    // ✅ NEW: checkbox explicitly touch করলে re-extract করা হবে
    if (showInVideoSection !== undefined) {
      const videoMeta = showInVideoSection ? extractYoutubeVideo(news.content) : null;
      news.showInVideoSection = Boolean(showInVideoSection) && Boolean(videoMeta);
      news.videoMeta = videoMeta;
    } else if (content && news.showInVideoSection) {
      // checkbox না ছুঁলেও body বদলে গেলে পুরনো videoId/thumbnail stale থেকে যেতে পারে,
      // তাই flag অক্ষত রেখে videoMeta-টা re-sync করা হচ্ছে
      const videoMeta = extractYoutubeVideo(news.content);
      news.showInVideoSection = Boolean(videoMeta);
      news.videoMeta = videoMeta;
    }

    news.updatedBy = req.user._id;

    await news.save();

    // ✅ NEW: update-এর পরও flag true থাকলে cap enforce করা
    if (news.showInVideoSection) {
      await enforceVideoSectionLimit();
    }

    res.status(200).json({
      success: true,
      message: 'News updated successfully',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get All News
 * @route GET /api/news
 */
export const getAllNews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.isFeatured) {
      query.isFeatured = req.query.isFeatured === "true";
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.categorySlug) {
      const category = await Category.findOne({
        slug: req.query.categorySlug,
        isActive: true,
      });

      if (!category) {
        return res.status(200).json({
          success: true,
          meta: {
            total: 0,
            page,
            pages: 0,
          },
          data: [],
        });
      }

      query.category = category._id;
    }

    if (req.query.author) {
      query.author = req.query.author;
    }

      if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    // ✅ NEW: Visibility access control
    // - Admin/Superadmin: যেকোনো status/author filter করতে পারবে
    // - নিজের author id দিয়ে request করলে (Manage News / Pending list):
    //   নিজের যেকোনো status-এর article দেখতে পারবে
    // - বাকি সবাই (guest / অন্য কারো article চাওয়া non-privileged user):
    //   শুধু published দেখতে পারবে — draft/review কখনো leak হবে না
    const role = req.user?.role;
    const isPrivileged = role === "admin" || role === "superadmin";
    const isSelfAuthorRequest =
      req.user &&
      req.query.author &&
      req.query.author === req.user._id.toString();

    if (isPrivileged) {
      if (req.query.status) query.status = req.query.status;
      if (req.query.author) query.author = req.query.author;
    } else if (isSelfAuthorRequest) {
      query.author = req.user._id;
      if (req.query.status) query.status = req.query.status;
    } else {
      query.status = "published";
      if (req.query.author) query.author = req.query.author;
    }

    const total = await News.countDocuments(query);

    const newsList = await News.find(query)
      .select("-content")
      .populate("category", "name slug")
      .populate({
        path: "author",
        ...AUTHOR_POPULATE, // ✅ CHANGED: username, avatar সহ centralized populate
      })
      .populate({
        path: "updatedBy",
        ...AUTHOR_POPULATE, // ✅ CHANGED
      })
      .populate(
        "thumbnail.media",
        "url cloudinaryPublicId alt caption credit width height mimeType"
      )
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: newsList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Single News by ID or Slug
 * @route GET /api/news/:identifier
 */
export const getSingleNews = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const news = await News.findOne(query)
      .populate('category', 'name slug')
      .populate({
        path: 'author',
        ...AUTHOR_POPULATE, // ✅ CHANGED: username, avatar সহ centralized populate
      })
      .populate({
        path: 'updatedBy',
        ...AUTHOR_POPULATE, // ✅ CHANGED
      })
      .populate(
        'thumbnail.media',
        'url cloudinaryPublicId alt caption credit width height mimeType'
      );

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found.' });
    }

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get published news flagged for the Video section
 * @route GET /api/news/videos
 */
export const getVideoNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    const query = {
      status: "published",
      showInVideoSection: true,
      "videoMeta.videoId": { $ne: null },
    };

    if (req.query.categorySlug) {
      const category = await Category.findOne({
        slug: req.query.categorySlug,
        isActive: true,
      });

      if (!category) {
        return res.status(200).json({ success: true, data: [] });
      }

      query.category = category._id;
    }

    const newsList = await News.find(query)
      .select("-content")
      .populate("category", "name slug")
      .populate("thumbnail.media", "url alt")
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: newsList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get aggregated stats for the logged-in writer (used by Writer Dashboard)
 * @route GET /api/news/writer-stats
 */
export const getWriterStats = async (req, res, next) => { // ✅ NEW
  try {
    const authorId = new mongoose.Types.ObjectId(req.user._id);

    const [stats] = await News.aggregate([
      { $match: { author: authorId } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalComments: { $sum: '$commentsCount' },
          totalShares: { $sum: '$sharesCount' },
          totalBookmarks: { $sum: '$bookmarksCount' },
          draftCount: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] },
          },
          publishedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] },
          },
          featuredCount: {
            $sum: { $cond: ['$isFeatured', 1, 0] },
          },
        },
      },
    ]);

    const defaults = {
      totalPosts: 0,
      totalViews: 0,
      totalComments: 0,
      totalShares: 0,
      totalBookmarks: 0,
      draftCount: 0,
      publishedCount: 0,
      featuredCount: 0,
    };

    const data = stats
      ? {
          totalPosts: stats.totalPosts,
          totalViews: stats.totalViews,
          totalComments: stats.totalComments,
          totalShares: stats.totalShares,
          totalBookmarks: stats.totalBookmarks,
          draftCount: stats.draftCount,
          publishedCount: stats.publishedCount,
          featuredCount: stats.featuredCount,
        }
      : defaults;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc Get top viewed published news (used by Admin Dashboard "Top Views News" panel)
 * @route GET /api/news/top-viewed
 * @access Private (admin, superadmin)
 */
export const getTopViewedNews = async (req, res, next) => { // ✅ NEW
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const newsList = await News.find({ status: 'published' })
      .select('title slug views category author thumbnail publishedAt createdAt')
      .populate('category', 'name slug')
      .populate({
        path: 'author',
        select: 'name username avatar',
      })
      .populate('thumbnail.media', 'url alt')
      .sort({ views: -1 }) // ✅ existing { status: 1, views: -1 } index ব্যবহার করবে
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: newsList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete News
 * @route DELETE /api/news/:id
 */
export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found.' });
    }

    const isOwner = news.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this article.',
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: 'News deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc Approve a submitted article (review -> published)
 * @route PATCH /api/news/:id/approve
 * @access Private (admin, superadmin)
 */
export const approveNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found.' });
    }

    if (news.status !== 'review') {
      return res.status(400).json({
        success: false,
        message: 'যে আর্টিকেল এখন Review-তে আছে, শুধু সেটাই Approve করা যাবে।',
      });
    }

    news.status = 'published';
    news.reviewedBy = req.user._id;
    news.reviewNote = '';

    await news.save();

    if (news.showInVideoSection) {
      await enforceVideoSectionLimit();
    }

    res.status(200).json({
      success: true,
      message: 'Article approved and published.',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Reject a submitted article (review -> draft)
 * @route PATCH /api/news/:id/reject
 * @access Private (admin, superadmin)
 */
export const rejectNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found.' });
    }

    if (news.status !== 'review') {
      return res.status(400).json({
        success: false,
        message: 'যে আর্টিকেল এখন Review-তে আছে, শুধু সেটাই Reject করা যাবে।',
      });
    }

    news.status = 'draft';
    news.reviewedBy = req.user._id;
    news.reviewNote = reason?.trim() || '';

    await news.save();

    res.status(200).json({
      success: true,
      message: 'Article sent back to draft.',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};