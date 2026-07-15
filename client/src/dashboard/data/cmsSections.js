import { LayoutPanelTop, House, LayoutTemplate, Search } from "lucide-react";

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
 * @property {string} id - Unique across the whole config; used as a React key and for lookups.
 * @property {string} title - Label shown on the manage tile / modal header.
 * @property {string} description - Short helper text shown under the title.
 * @property {string} manager - Key into managerComponents.js that renders this item's editor.
 * @property {CMSItemType} type
 * @property {string} collection - Backend collection/settings key this item reads and writes.
 * @property {boolean} multiple - Whether this holds many entries (list) or a single one (group/image).
 * @property {boolean} visible - Whether this tile is shown in the CMS admin list. This is
 *   NOT the live front-end visibility of the section's content on the site — that's a
 *   separate, per-content flag (e.g. the visibility toggle inside ImageManager).
 */

/**
 * @typedef {Object} CMSSectionGroup
 * @property {string} id
 * @property {string} title
 * @property {import("react").ComponentType} icon
 * @property {CMSItem[]} items
 */

/** @type {CMSSectionGroup[]} */
const cmsSections = [
  // ===============================
  // HEADER
  // ===============================
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
        id: "topHeader",
        title: "Top Header",
        description: "Manage top header content",
        manager: "topHeader",
        type: CMS_ITEM_TYPES.GROUP,
        collection: "topHeader",
        multiple: false,
        visible: true,
      },
      {
        id: "topHeadline",
        title: "Top Headline",
        description: "Manage breaking headline section",
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

  // ===============================
  // HOMEPAGE
  // ===============================
  {
    id: "homepage",
    title: "Homepage",
    icon: House,
    items: [
      {
        id: "heroSlider",
        title: "Hero Slider",
        description: "Homepage hero slider",
        manager: "HeroSliderManager",
        type: CMS_ITEM_TYPES.LIST,
        collection: "heroSlider",
        multiple: true,
        visible: true,
      },
      {
        id: "breakingNews",
        title: "Breaking News",
        description: "Breaking news section",
        manager: "BreakingNewsManager",
        type: CMS_ITEM_TYPES.LIST,
        collection: "breakingNews",
        multiple: true,
        visible: true,
      },
      {
        id: "featuredNews",
        title: "Featured News",
        description: "Featured news section",
        manager: "FeaturedNewsManager",
        type: CMS_ITEM_TYPES.LIST,
        collection: "featuredNews",
        multiple: true,
        visible: true,
      },
      {
        id: "latestNews",
        title: "Latest News",
        description: "Latest news section",
        manager: "LatestNewsManager",
        type: CMS_ITEM_TYPES.LIST,
        collection: "latestNews",
        multiple: true,
        visible: true,
      },
      {
        id: "categorySection",
        title: "Category Section",
        description: "Homepage categories",
        manager: "CategorySectionManager",
        type: CMS_ITEM_TYPES.LIST,
        collection: "categorySection",
        multiple: true,
        visible: true,
      },
      {
        id: "gallery",
        title: "Gallery",
        description: "Homepage gallery",
        manager: "GalleryManager",
        type: CMS_ITEM_TYPES.LIST,
        collection: "gallery",
        multiple: true,
        visible: true,
      },
      {
        id: "advertisement",
        title: "Advertisement",
        description: "Homepage advertisements",
        manager: "AdvertisementManager",
        type: CMS_ITEM_TYPES.LIST,
        collection: "advertisement",
        multiple: true,
        visible: true,
      },
      {
        id: "notice",
        title: "Notice Board",
        description: "Homepage notice",
        manager: "NoticeManager",
        type: CMS_ITEM_TYPES.LIST,
        collection: "notice",
        multiple: true,
        visible: true,
      },
    ],
  },

  // ===============================
  // FOOTER
  // ===============================
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

  // ===============================
  // SEO
  // ===============================
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

// Prevent accidental runtime mutation of shared config — e.g. some component
// doing `item.visible = false` directly instead of going through real state.
const deepFreeze = (value) => {
  Object.getOwnPropertyNames(value).forEach((prop) => {
    const child = value[prop];
    if (child && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child);
    }
  });
  return Object.freeze(value);
};

deepFreeze(cmsSections);

/** Flat list of every item across every section — handy for search/lookup. */
export const getAllItems = () =>
  cmsSections.flatMap((section) => section.items);

/** Find a single item by its id, wherever it lives in the config. */
export const getItemById = (id) =>
  getAllItems().find((item) => item.id === id) ?? null;

/** Find a top-level section group by its id. */
export const getSectionById = (id) =>
  cmsSections.find((section) => section.id === id) ?? null;

export default cmsSections;
