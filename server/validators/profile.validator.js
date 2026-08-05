import Joi from "joi";

// ==========================================
// Common Rules
// ==========================================

const urlRule = Joi.string().uri().allow("").messages({
  "string.uri": "Please enter a valid URL.",
});

const phoneRule = Joi.string()
  .max(20)
  .allow("")
  .messages({
    "string.max": "Phone number is too long.",
  });

// ==========================================
// Update Profile
// ==========================================

export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      "string.empty": "Name is required.",
    }),

  username: Joi.string()
    .min(3)
    .max(30)
    .lowercase()
    .trim()
    .optional(),

  bio: Joi.string()
    .max(500)
    .allow("")
    .optional(),

  phone: phoneRule.optional(),

  address: Joi.string()
    .max(200)
    .allow("")
    .optional(),

  occupation: Joi.string()
    .max(100)
    .allow("")
    .optional(),

  website: urlRule.optional(),

  socialLinks: Joi.object({
    facebook: urlRule,

    twitter: urlRule,

    linkedin: urlRule,

    github: urlRule,
  }).optional(),
});

// ==========================================
// Change Password
// ==========================================

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      "string.empty": "Current password is required.",
    }),

  newPassword: Joi.string()
    .min(6)
    .max(50)
    .required()
    .messages({
      "string.min":
        "Password must be at least 6 characters.",
    }),
});