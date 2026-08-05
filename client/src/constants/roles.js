export const ROLE_HOME_PATH = {
  superadmin: "admin",
  admin: "admin",
  writer: "writer",
  reader: "reader",
};

// Backend/DB তে role "Superadmin", "SUPERADMIN", " superadmin " ইত্যাদি
// যেকোনো ভাবে থাকলেও যাতে সঠিক মিলে যায়, তাই এই helper দিয়েই সবসময় lookup করা উচিত।
export const getRoleHomePath = (role) => {
  const normalizedRole = (role || "").toString().trim().toLowerCase();
  return ROLE_HOME_PATH[normalizedRole] ?? "unable-access";
};
