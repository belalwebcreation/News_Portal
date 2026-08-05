import Joi from 'joi';

// ১. নতুন নিউজ তৈরির সময় ইনপুট ভ্যালিডেশন স্কিমা
export const createNewsSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(250)
    .required()
    .messages({
      'string.empty': 'নিউজের শিরোনাম ফাঁকা হতে পারবে না',
      'any.required': 'নিউজের শিরোনাম দেওয়া আবশ্যক',
      'string.max': 'শিরোনাম ২৫০ অক্ষরের বেশি হতে পারবে না'
    }),

  summary: Joi.string()
    .trim()
    .allow('')
    .max(500)
    .messages({
      'string.max': 'সংক্ষিপ্ত বিবরণ ৫০০ অক্ষরের বেশি হতে পারবে না'
    }),

  content: Joi.string()
    .required()
    .messages({
      'string.empty': 'নিউজের বিস্তারিত বিবরণ ফাঁকা হতে পারবে না',
      'any.required': 'নিউজের বিস্তারিত বিবরণ দেওয়া আবশ্যক'
    }),

  thumbnail: Joi.string()
    .required()
    .messages({
      'string.empty': 'থাম্বনেইল ইমেজ পাথ ফাঁকা হতে পারবে না',
      'any.required': 'নিউজের থাম্বনেইল ইমেজ আবশ্যক'
    }),

  category: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      'string.length': 'অবৈধ ক্যাটাগরি আইডি',
      'string.hex': 'অবৈধ ক্যাটাগরি আইডি ফরম্যাট',
      'any.required': 'নিউজটি কোন ক্যাটাগরির তা নির্দিষ্ট করা আবশ্যক'
    }),

  // writer স্কিমাতে থাকছে জাস্ট ইন কেস, তবে বডি থেকে পাস করার প্রয়োজন নেই
  writer: Joi.string()
    .length(24)
    .hex()
    .optional(),

  status: Joi.string()
    .valid('draft', 'published')
    .default('draft')
    .messages({
      'any.only': 'স্ট্যাটাস শুধুমাত্র draft অথবা published হতে পারবে'
    }),

  tags: Joi.array()
    .items(Joi.string().trim())
    .default([]),

  readingTime: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'রিডিং টাইম নেগেটিভ হতে পারবে না'
    }),

  isBreaking: Joi.boolean()
    .default(false),

  isFeatured: Joi.boolean()
    .default(false),
});

// ২. নিউজ আপডেট করার সময় ভ্যালিডেশন স্কিমা (প্রধান রিকোয়ার্ড ফিল্ডগুলোকে অপশনাল করা হলো)
export const updateNewsSchema = createNewsSchema.fork(
  ['title', 'content', 'thumbnail', 'category'],
  (field) => field.optional()
);