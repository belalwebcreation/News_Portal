import SiteSetting from "../models/SiteSetting.js";
import navbarSettingRepository from "../repositories/navbarSetting.repository.js";

/* ======================================================
   GET OR CREATE SETTINGS (With Auto-Repair / Self-Healing)
====================================================== */

const getOrCreateSettings = async () => {
  let settings = await SiteSetting.findOne();

  // ১) নতুন ডাটাবেজ সেটআপে লোগোসহ ডিফল্ট হোম মেনু তৈরি
  if (!settings) {
    settings = await SiteSetting.create({
      logo: "",
      logoPublicId: "",
      logoVisible: true,
      navbar: [
        {
          isHome: true,
          title: "প্রচ্ছদ",
          category: null,
          position: "left",
          visible: true,
          order: 0,
        },
      ],
    });
  }

  // ২) অটো-রিপেয়ার লজিক: পুরনো বা ড্যামেজড ডাটাবেজে Home মেনু মিসিং থাকলে তা রিকভার করা
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

    await settings.save();
  }

  return settings;
};


/* ======================================================
   GET NAVBAR MENUS
====================================================== */

const getNavbarMenus = async () => {
  return await navbarSettingRepository.getNavbarMenus();
};


/* ======================================================
   ADD MENU
====================================================== */

const addNavbarMenu = async (menuData) => {
  if (!menuData?.category) {
    throw new Error("Category is required.");
  }

  if (
    menuData.position &&
    !["left", "right"].includes(menuData.position)
  ) {
    throw new Error("Invalid position.");
  }

  return await navbarSettingRepository.addNavbarMenu({
    category: menuData.category,
    position: menuData.position || "left",
  });
};


/* ======================================================
   UPDATE MENU
====================================================== */

const updateNavbarMenu = async (
  menuId,
  menuData
) => {
  if (!menuId) {
    throw new Error("Menu id is required.");
  }

  if (
    menuData.position &&
    !["left", "right"].includes(menuData.position)
  ) {
    throw new Error("Invalid position.");
  }

  return await navbarSettingRepository.updateNavbarMenu(
    menuId,
    menuData
  );
};


/* ======================================================
   DELETE MENU
====================================================== */

const deleteNavbarMenu = async (
  menuId
) => {
  if (!menuId) {
    throw new Error("Menu id is required.");
  }

  return await navbarSettingRepository.deleteNavbarMenu(
    menuId
  );
};


/* ======================================================
   TOGGLE VISIBILITY
====================================================== */

const toggleNavbarMenu = async (
  menuId
) => {
  if (!menuId) {
    throw new Error("Menu id is required.");
  }

  return await navbarSettingRepository.toggleNavbarMenu(
    menuId
  );
};


/* ======================================================
   REORDER MENUS
====================================================== */

const reorderNavbarMenus = async (
  menus
) => {
  if (!Array.isArray(menus)) {
    throw new Error("Menus must be an array.");
  }

  return await navbarSettingRepository.reorderNavbarMenus(
    menus
  );
};


export default {
  getOrCreateSettings,
  getNavbarMenus,
  addNavbarMenu,
  updateNavbarMenu,
  deleteNavbarMenu,
  toggleNavbarMenu,
  reorderNavbarMenus,
};