import BreakingNews from "../models/breakingNewsModel.js";

/**
 * -----------------------------------------
 * Ensure Breaking News Document Exists
 * -----------------------------------------
 */
const getOrCreateBreakingNews = async () => {
  let breakingNews = await BreakingNews.findOne();

  if (!breakingNews) {
    breakingNews = await BreakingNews.create({
      label: "সর্বশেষ",
      date: "",
      showDate: true,
      visible: true,
      speed: 5,
      items: [],
    });
  }

  return breakingNews;
};

/**
 * -----------------------------------------
 * GET Breaking News
 * -----------------------------------------
 */
export const getBreakingNews = async (req, res) => {
  try {
    const breakingNews = await getOrCreateBreakingNews();

    res.status(200).json({
      success: true,
      breakingNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * -----------------------------------------
 * UPDATE Breaking News
 * -----------------------------------------
 */
export const updateBreakingNews = async (req, res) => {
  try {
    const {
      label,
      date,
      showDate,
      visible,
      speed,
      items,
    } = req.body;

    const breakingNews = await getOrCreateBreakingNews();

    breakingNews.label = label;
    breakingNews.date = date;
    breakingNews.showDate = showDate;
    breakingNews.visible = visible;
    breakingNews.speed = speed;
    breakingNews.items = items;

    await breakingNews.save();

    res.status(200).json({
      success: true,
      message: "Breaking News Updated Successfully",
      breakingNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * -----------------------------------------
 * ADD Breaking News Item
 * -----------------------------------------
 */
export const addBreakingNews = async (req, res) => {
  try {
    const { title, slug } = req.body;

    if (!title?.trim() || !slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required.",
      });
    }

    const breakingNews = await getOrCreateBreakingNews();

    breakingNews.items.push({
      title,
      slug,
      visible: true,
    });

    await breakingNews.save();

    const newItem =
      breakingNews.items[breakingNews.items.length - 1];

    res.status(201).json({
      success: true,
      item: newItem,
      breakingNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * -----------------------------------------
 * DELETE Breaking News Item
 * -----------------------------------------
 */
export const deleteBreakingNews = async (req, res) => {
  try {
    const { id } = req.params;

    const breakingNews = await getOrCreateBreakingNews();

    const itemExists = breakingNews.items.some(
      (item) => item._id.toString() === id
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Breaking News not found.",
      });
    }

    breakingNews.items = breakingNews.items.filter(
      (item) => item._id.toString() !== id
    );

    await breakingNews.save();

    res.status(200).json({
      success: true,
      breakingNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * -----------------------------------------
 * Toggle Breaking News Visibility
 * -----------------------------------------
 */
export const toggleBreakingNewsVisibility = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const breakingNews = await getOrCreateBreakingNews();

    const item = breakingNews.items.id(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Breaking News not found.",
      });
    }

    item.visible = !item.visible;

    await breakingNews.save();

    res.status(200).json({
      success: true,
      breakingNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};