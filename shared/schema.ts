import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  imageUrl: true,
});

// Tours
export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  imageUrl: text("image_url"),
  duration: integer("duration").notNull(), // in days
  price: integer("price").notNull(), // in MAD
  discountPrice: integer("discount_price"), // Prix réduit pour les promotions
  locations: text("locations").notNull(), // comma separated
  featured: boolean("featured").default(false),
  categoryId: integer("category_id"),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  tourPlan: jsonb("tour_plan"), // array of { day, title, description }
  mapPoints: jsonb("map_points"), // array of { lat, lng, title }
});

export const insertTourSchema = createInsertSchema(tours).pick({
  title: true,
  description: true,
  shortDescription: true,
  imageUrl: true,
  duration: true,
  price: true,
  discountPrice: true,
  locations: true,
  featured: true,
  categoryId: true,
  tourPlan: true,
  mapPoints: true,
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  startDate: text("start_date").notNull(),
  persons: integer("persons").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  tourId: true,
  fullName: true,
  email: true,
  phone: true,
  startDate: true,
  persons: true,
  totalPrice: true,
});

// Custom tour requests
export const customRequests = pgTable("custom_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"), // Nouveau champ pour le numéro de téléphone
  destination: text("destination").notNull(),
  budget: text("budget").notNull(),
  departureDate: text("departure_date").notNull(),
  persons: integer("persons").notNull(),
  durationDays: integer("duration_days"), // Nouveau champ pour la durée du voyage en jours
  interests: text("interests"), // comma separated
  additionalDetails: text("additional_details"),
  status: text("status").default("new"), // new, in-progress, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomRequestSchema = createInsertSchema(customRequests).pick({
  fullName: true,
  email: true,
  phone: true, // Ajouté au schema d'insertion
  destination: true,
  budget: true,
  departureDate: true,
  persons: true,
  durationDays: true,
  interests: true,
  additionalDetails: true,
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in MAD
  discountPrice: integer("discount_price"),
  imageUrl: text("image_url"),
  category: text("category").notNull(), // artisanal, souvenirs, etc.
  isNew: boolean("is_new").default(false),
  inStock: boolean("in_stock").default(true),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  discountPrice: true,
  imageUrl: true,
  category: true,
  isNew: true,
  inStock: true,
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  zipCode: text("zip_code"),
  items: jsonb("items").notNull(), // array of { productId, quantity, price }
  totalAmount: integer("total_amount").notNull(),
  status: text("status").default("pending"), // pending, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerName: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  zipCode: true,
  items: true,
  totalAmount: true,
});

// Blog Articles
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  category: text("category").notNull(), // destinations, cuisine, adventure, etc.
  publishDate: timestamp("publish_date").defaultNow(),
  author: text("author").default("Admin"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  excerpt: true,
  imageUrl: true,
  category: true,
  author: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  country: true,
  avatar: true,
  rating: true,
  comment: true,
});

// Newsletter subscription
export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  email: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tour = typeof tours.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type CustomRequest = typeof customRequests.$inferSelect;
export type InsertCustomRequest = z.infer<typeof insertCustomRequestSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
