import TopHeadline from "../models/TopHeadline.js";

/**
 * Ensures a TopHeadline document always exists before an operation
 * touches it. Prevents "Cannot read properties of null" crashes
 * when an action runs before the document has ever been created.
 */
const getOrCreateHeadline = async () => {
  let headline = await TopHeadline.findOne();

  if (!headline) {
    headline = await TopHeadline.create({
      label: "সর্বশেষ",
      date: "",
      showDate: true,
      visible: true,
      speed: 5,
      items: [],
    });
  }

  return headline;
};

/**
 * GET Top Headline
 */

export const getTopHeadline = async (req, res) => {
  try {
    const headline = await getOrCreateHeadline();

    res.status(200).json({
      success: true,
      headline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE Top Headline
 */

export const updateTopHeadline = async (req, res) => {
  try {
    const {
      label,
      date,
      showDate,
      visible,
      speed,
      items,
    } = req.body;

    const headline = await getOrCreateHeadline();

    headline.label = label;
    headline.date = date;
    headline.showDate = showDate;
    headline.visible = visible;
    headline.speed = speed;
    headline.items = items;

    await headline.save();

    res.status(200).json({
      success: true,
      message: "Top Headline Updated Successfully",
      headline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ADD Headline
 */

export const addHeadline = async (req, res) => {
  console.log("ADD API HIT");
  try {
    const { title, slug } = req.body;

    if (!title?.trim() || !slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required.",
      });
    }

    const headline = await getOrCreateHeadline();

    headline.items.push({
      title,
      slug,
      visible: true,
      order: headline.items.length + 1,
    });

    await headline.save();
    console.log(headline.items);
console.log("Items Length:", headline.items.length);

    const newItem = headline.items[headline.items.length - 1];

res.status(201).json({
  success: true,
  item: newItem,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE Headline
 */

export const deleteHeadline = async (req, res) => {
  try {
    const { id } = req.params;

    const headline = await getOrCreateHeadline();

    const itemExists = headline.items.some(
      (item) => item._id.toString() === id
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Headline not found.",
      });
    }

    headline.items = headline.items.filter(
      (item) => item._id.toString() !== id
    );

    await headline.save();

    res.status(200).json({
      success: true,
      headline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Toggle Visibility
 */

export const toggleHeadlineVisibility = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const headline = await getOrCreateHeadline();

    const item = headline.items.id(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Headline not found.",
      });
    }

    item.visible = !item.visible;

    await headline.save();

    res.status(200).json({
      success: true,
      headline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
