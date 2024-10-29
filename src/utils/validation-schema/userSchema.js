import Joi from "joi";

// Base schema for user fields
const userBaseSchema = {
  full_name: Joi.string().max(255).optional(),
  email: Joi.string().email().max(255).optional(),
  reporter_code: Joi.string().max(100).optional(),
  hashed_password: Joi.string().max(255).optional(),
  password_salt: Joi.string().max(255).optional(),
  phone_number: Joi.string().max(20).optional(),
  profile_image_url: Joi.string().optional(),
  street_address: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  postal_code: Joi.string().max(20).optional(),
  country: Joi.string().max(100).optional(),
  role: Joi.string().valid('reporter', 'editor', 'admin', 'user').optional(),
  status: Joi.string().valid('active', 'blocked', 'suspended').optional(),
  bio: Joi.string().optional(),
  designation: Joi.string().max(100).optional(),
  experience_years: Joi.number().integer().min(0).optional(),
  social_media_links: Joi.string().optional(),
  articles_published: Joi.number().integer().min(0).optional(),
  total_views: Joi.number().integer().min(0).optional(),
  total_bookmarked_news: Joi.number().integer().min(0).optional(),
  total_favorite_news: Joi.number().integer().min(0).optional(),
  profile_completion: Joi.number().integer().min(0).max(100).optional(),
  last_login: Joi.date().optional()
};

// Create schema
export const createUserSchema = Joi.object({
  full_name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  // hashed_password: Joi.string().max(255).required(),
  // password_salt: Joi.string().max(255).required(),
  // role: Joi.string().valid('reporter', 'editor', 'admin').required(),
  ...userBaseSchema
});

// Update schema
export const updateUserSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  ...userBaseSchema
});

// Patch schema (for partial updates)
export const patchUserSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  ...userBaseSchema
}).min(1); // Require at least one field for patch
