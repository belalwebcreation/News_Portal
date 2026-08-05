import asyncHandler from "express-async-handler";
import navbarSettingService from "../services/navbarSetting.service.js";


// =======================================
// GET NAVBAR MENUS
// =======================================

export const getNavbarMenus = asyncHandler(async (req, res) => {

  const menus = await navbarSettingService.getNavbarMenus();

  res.status(200).json({
    success: true,
    menus,
  });

});


// =======================================
// ADD NAVBAR MENU
// =======================================

export const addNavbarMenu = asyncHandler(async (req, res) => {

  const { category, position } = req.body;


  if (!category) {
    res.status(400);
    throw new Error("Category is required");
  }


  const menus =
    await navbarSettingService.addNavbarMenu({
      category,
      position,
    });


  res.status(201).json({
    success: true,
    message: "Menu item added successfully.",
    menus,
  });

});


// =======================================
// UPDATE NAVBAR MENU
// =======================================

export const updateNavbarMenu = asyncHandler(async (req, res) => {

  const menu =
    await navbarSettingService.updateNavbarMenu(
      req.params.menuId,
      req.body
    );


  res.status(200).json({
    success: true,
    message: "Menu updated successfully.",
    menu,
  });

});


// =======================================
// TOGGLE VISIBILITY
// =======================================

export const toggleNavbarMenu = asyncHandler(async (req, res) => {

  const menu =
    await navbarSettingService.toggleNavbarMenu(
      req.params.menuId
    );


  res.status(200).json({
    success:true,
    message:"Visibility updated",
    menu,
  });

});


// =======================================
// DELETE NAVBAR MENU
// =======================================

export const deleteNavbarMenu = asyncHandler(async (req,res)=>{

  await navbarSettingService.deleteNavbarMenu(
    req.params.menuId
  );


  res.status(200).json({
    success:true,
    message:"Menu deleted successfully",
  });

});


// =======================================
// REORDER NAVBAR
// =======================================

export const reorderNavbarMenus = asyncHandler(async(req,res)=>{

  const { menus } = req.body;


  if(!Array.isArray(menus)){
    res.status(400);
    throw new Error("Menus array required");
  }


  const updatedMenus =
    await navbarSettingService.reorderNavbarMenus(
      menus
    );


  res.status(200).json({
    success:true,
    message:"Navbar reordered successfully",
    menus: updatedMenus,
  });

});