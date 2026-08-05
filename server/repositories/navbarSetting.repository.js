import SiteSetting from "../models/SiteSetting.js";
import Category from "../models/categoryModel.js";

/* ======================================================
   GET OR CREATE SETTINGS
====================================================== */

const getOrCreateSettings = async () => {
  let settings = await SiteSetting.findOne();

  if (!settings) {
    settings = await SiteSetting.create({
      navbar: [],
    });
  }

  if (!Array.isArray(settings.navbar)) {
    settings.navbar = [];
  }

  const hasHome = settings.navbar.some(
    (item) => item.isHome === true
  );

  if (!hasHome) {
    settings.navbar.unshift({
      isHome: true,
      title: "প্রচ্ছদ",
      category: null,
      position: "left",
      visible: true,
      order: 0,
    });

    // order ঠিক করে দাও
    settings.navbar.forEach((item, index) => {
      item.order = index;
    });

    await settings.save();
  }

  return settings;
};

/* ======================================================
   GET NAVBAR MENUS
====================================================== */

const getNavbarMenus = async () => {
  const settings = await getOrCreateSettings();

  await settings.populate({
    path: "navbar.category",
  });

  return [...settings.navbar].sort(
    (a, b) => a.order - b.order
  );
};

/* ======================================================
   ADD CATEGORY TO NAVBAR
====================================================== */

const addNavbarMenu = async ({
  category,
  position,
}) => {
  const settings = await getOrCreateSettings();

  const categoryExists =
    await Category.findById(category);

  if (!categoryExists) {
    throw new Error("Category not found.");
  }

  const alreadyAdded =
    settings.navbar.find(
      (item) =>
        item.category &&
        item.category.toString() === category
    );

  if (alreadyAdded) {
    throw new Error(
      "Category already added."
    );
  }

  const maxOrder =
    settings.navbar.length > 0
      ? Math.max(
          ...settings.navbar.map(
            (item) => item.order
          )
        )
      : 0;

  settings.navbar.push({
    category,
    position: position || "left",
    visible: true,
    order: maxOrder + 1,
  });

  await settings.save();

  await settings.populate({
    path: "navbar.category",
  });

  return settings.navbar;
};

/* ======================================================
   UPDATE MENU
====================================================== */

const updateNavbarMenu = async (
  menuId,
  menuData
) => {
  const settings =
    await getOrCreateSettings();

  const menu =
    settings.navbar.id(menuId);

  if (!menu) {
    throw new Error(
      "Navbar item not found."
    );
  }

  // Home
  if (menu.isHome) {
    if (menuData.title !== undefined) {
      menu.title = menuData.title;
    }
  } else {
    if (menuData.position !== undefined) {
      menu.position =
        menuData.position;
    }
  }

  if (menuData.visible !== undefined) {
    menu.visible =
      menuData.visible;
  }

  await settings.save();

  await settings.populate({
    path: "navbar.category",
  });

  return menu;
};

/* ======================================================
   DELETE MENU
====================================================== */

const deleteNavbarMenu = async (
  menuId
) => {
  const settings =
    await getOrCreateSettings();

  const menu =
    settings.navbar.id(menuId);

  if (!menu) {
    throw new Error(
      "Navbar item not found."
    );
  }

  if (menu.isHome) {
    throw new Error(
      "Home menu cannot be deleted."
    );
  }

  menu.deleteOne();

  settings.navbar.forEach(
    (item, index) => {
      item.order = index;
    }
  );

  await settings.save();

  return true;
};

/* ======================================================
   TOGGLE VISIBILITY
====================================================== */

const toggleNavbarMenu = async (
  menuId
) => {
  const settings =
    await getOrCreateSettings();

  const menu =
    settings.navbar.id(menuId);

  if (!menu) {
    throw new Error(
      "Navbar item not found."
    );
  }

  menu.visible = !menu.visible;

  await settings.save();

  await settings.populate({
    path: "navbar.category",
  });

  return menu;
};

/* ======================================================
   REORDER MENUS
====================================================== */

const reorderNavbarMenus = async (
  menus
) => {
  const settings =
    await getOrCreateSettings();

  menus.forEach((item) => {
    const menu =
      settings.navbar.id(item._id);

    if (menu) {
      menu.order = item.order;
    }
  });

  await settings.save();

  await settings.populate({
    path: "navbar.category",
  });

  return [...settings.navbar].sort(
    (a, b) => a.order - b.order
  );
};

export default {
  getNavbarMenus,
  addNavbarMenu,
  updateNavbarMenu,
  deleteNavbarMenu,
  toggleNavbarMenu,
  reorderNavbarMenus,
};