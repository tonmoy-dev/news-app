import Joi from "joi";

// Base schema for the news fields
const newsBaseSchema = {
  title: Joi.string().max(255).optional(),
  sub_title: Joi.string().max(255).optional(),
  category: Joi.string().max(100).optional(),
  location: Joi.string().max(255).optional(),
  reporter: Joi.string().max(100).optional(),
  thumbnail_image: Joi.string().max(255).optional(),
  thumbnail_url: Joi.string().max(255).optional(),
  youtube_video_url: Joi.string().uri().optional(),
  watermark_image: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
  content: Joi.string().optional(),
  published_date: Joi.date().optional(),
  trending_news: Joi.boolean().optional(),
  featured_news: Joi.boolean().optional(),
  total_views: Joi.number().integer().optional(),
  total_impressions: Joi.number().integer().optional(),
  tags: Joi.string().max(255).optional(),
  status: Joi.string().valid('Approved', 'Pending', 'Blocked').optional(),
};

// Create Schema
export const createNewsSchema = Joi.object({
  ...newsBaseSchema,
  title: Joi.string().max(255).required(), // Title remains required for creation
  category: Joi.string().max(100).required(), // Category remains required for creation
  location: Joi.string().max(255).required(), // Location remains required for creation
  reporter: Joi.string().max(100).required(), // Reporter remains required for creation
  description: Joi.string().required(), // Description remains required for creation
  content: Joi.string().required(), // Content remains required for creation
  published_date: Joi.date().required(), // Published date remains required for creation
});

// Update Schema (allows fields to be optional)
export const updateNewsSchema = Joi.object({
  id: Joi.number().integer().positive().required(), // Include ID for update operations
  ...newsBaseSchema, // Include all fields as optional
});

// Patch Schema (allows partial updates)
export const patchNewsSchema = Joi.object({
  id: Joi.number().integer().positive().required(), // Include ID for patch operations
  ...newsBaseSchema, // Include all fields as optional
}).min(1); // At least one field must be present for patch
