import Joi from "joi";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(slugPattern)
    .required(),

  description: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .default(""),

  isActive: Joi.boolean().default(true),

  position: Joi.number()
    .integer()
    .min(0)
    .default(0),
});

export const updateCategorySchema = createCategorySchema.fork(
  ["name", "slug"],
  (schema) => schema.optional()
);