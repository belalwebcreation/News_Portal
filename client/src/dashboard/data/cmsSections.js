import {
  LayoutPanelTop,
  House,
  LayoutTemplate,
  Search,
} from "lucide-react";

/**
 * @typedef {"image" | "group" | "list"} CMSItemType
 */
export const CMS_ITEM_TYPES = {
  IMAGE: "image",
  GROUP: "group",
  LIST: "list",
};

/**
 * @typedef {Object} CMSItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} manager
 * @property {CMSItemType} type
 * @property {string} collection
 * @property {boolean} multiple
 * @property {boolean} visible
 */

/**
 * @typedef {Object} CMSSectionGroup
 * @property {string} id
 * @property {string} title
 * @property {import("react").ComponentType} icon
 * @property {CMSItem[]} items
 */

const cmsSections = [
  // ==================================================
  // HEADER
  // ==================================================

  {
    id: "header",
    title: "Header",
    icon: LayoutPanelTop,

    items: [
      {
        id: "logo",
        title: "Website Logo",
        description: "Upload or change website logo",

        manager: "logo",

        type: CMS_ITEM_TYPES.IMAGE,
        collection: "siteSettings",

        multiple: false,
        visible: true,
      },

      {
        id: "breakingNews",
        title: "Breaking News",
        description: "Manage breaking news ticker",

        manager: "breakingNews",

        type: CMS_ITEM_TYPES.LIST,
        collection: "breakingNews",

        multiple: true,
        visible: true,
      },

      {
        id: "topHeadline",
        title: "Top Headline",
        description: "Manage top headline cards",

        manager: "topHeadline",

        type: CMS_ITEM_TYPES.LIST,
        collection: "topHeadline",

        multiple: true,
        visible: true,
      },

      {
        id: "navbar",
        title: "Navbar",
        description: "Manage navigation menu",

        manager: "navbar",

        type: CMS_ITEM_TYPES.LIST,
        collection: "category",

        multiple: true,
        visible: true,
      },
    ],
  },

  // ==================================================
// ==================================================
  // HOMEPAGE
  // ==================================================

  {
    id: "homepage",
    title: "Homepage",
    icon: House,

    items: [
      {
        id: "banner",
        title: "Banner",
        description: "Homepage top banner image, link o visibility",

        manager: "banner",

        type: CMS_ITEM_TYPES.IMAGE,
        collection: "siteSettings",

        multiple: false,
        visible: true,
      },
    ],
  },
    // ==================================================
  // FOOTER
  // ==================================================

  {
    id: "footer",
    title: "Footer",
    icon: LayoutTemplate,

    items: [
      {
        id: "footerContent",
        title: "Footer",
        description: "Footer information",

        manager: "FooterManager",

        type: CMS_ITEM_TYPES.GROUP,
        collection: "footer",

        multiple: false,
        visible: true,
      },

      {
        id: "socialLinks",
        title: "Social Links",
        description: "Facebook, Youtube, X",

        manager: "SocialManager",

        type: CMS_ITEM_TYPES.GROUP,
        collection: "social",

        multiple: false,
        visible: true,
      },

      {
        id: "contact",
        title: "Contact",
        description: "Website contact information",

        manager: "ContactManager",

        type: CMS_ITEM_TYPES.GROUP,
        collection: "contact",

        multiple: false,
        visible: true,
      },
    ],
  },

  // ==================================================
  // SEO
  // ==================================================

  {
    id: "seo",
    title: "SEO",
    icon: Search,

    items: [
      {
        id: "seoSettings",
        title: "SEO Settings",
        description: "Meta title, meta description",

        manager: "SEOManager",

        type: CMS_ITEM_TYPES.GROUP,
        collection: "seo",

        multiple: false,
        visible: true,
      },
    ],
  },
];

/*
==================================================
Prevent Runtime Mutation
==================================================
*/

const deepFreeze = (value) => {
  Object.getOwnPropertyNames(value).forEach((prop) => {
    const child = value[prop];

    if (
      child &&
      typeof child === "object" &&
      !Object.isFrozen(child)
    ) {
      deepFreeze(child);
    }
  });

  return Object.freeze(value);
};

deepFreeze(cmsSections);

/*
==================================================
Helpers
==================================================
*/

export const getAllItems = () =>
  cmsSections.flatMap((section) => section.items);

export const getItemById = (id) =>
  getAllItems().find((item) => item.id === id) ?? null;

export const getSectionById = (id) =>
  cmsSections.find((section) => section.id === id) ?? null;

export default cmsSections;