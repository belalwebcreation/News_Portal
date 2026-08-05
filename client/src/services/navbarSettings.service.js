import api from "./api";

// =======================================
// Get Navbar Menu
// =======================================

const getNavbarMenus = async () => {
  const { data } = await api.get("/site-settings/navbar");
  return data;
};

// =======================================
// Add Category To Navbar
// =======================================

const addNavbarMenu = async (menuData) => {
  const { data } = await api.post(
    "/site-settings/navbar",
    {
      category: menuData.category,
      position: menuData.position || "left",
    }
  );

  return data;
};

// =======================================
// Update Navbar Item
// =======================================

const updateNavbarMenu = async (
  menuId,
  menuData
) => {
  const { data } = await api.put(
    `/site-settings/navbar/${menuId}`,
    {
      position: menuData.position,
      visible: menuData.visible,
    }
  );

  return data;
};

// =======================================
// Delete Navbar Item
// =======================================

const deleteNavbarMenu = async (
  menuId
) => {
  const { data } = await api.delete(
    `/site-settings/navbar/${menuId}`
  );

  return data;
};

// =======================================
// Toggle Visibility
// =======================================

const toggleNavbarMenu = async (
  menuId
) => {
  const { data } = await api.patch(
    `/site-settings/navbar/${menuId}/toggle`
  );

  return data;
};

// =======================================
// Reorder Navbar
// =======================================

const reorderNavbarMenus = async (
  menus
) => {
  const { data } = await api.patch(
    "/site-settings/navbar/reorder",
    {
      menus,
    }
  );

  return data;
};

// =======================================

const navbarSettingsService = {
  getNavbarMenus,
  addNavbarMenu,
  updateNavbarMenu,
  deleteNavbarMenu,
  toggleNavbarMenu,
  reorderNavbarMenus,
};

export default navbarSettingsService;