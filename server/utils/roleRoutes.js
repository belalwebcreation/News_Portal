export const roleRoutes = {
  admin: {
    profile: "/dashboard/admin/profile",
    settings: "/dashboard/account-settings", // অথবা admin/site-settings, যেটা ইচ্ছা
  },
  superadmin: {
    profile: "/dashboard/admin/profile",   // admin এর same page reuse
    settings: "/dashboard/account-settings",
  },
  writer: {
    profile: "/dashboard/writer/profile",
    settings: "/dashboard/account-settings",
  },
  reader: {
    profile: "/dashboard/reader/profile",
    settings: "/dashboard/reader/settings",
  },
};