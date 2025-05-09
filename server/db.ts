// filepath: c:\Users\Pavilion\Desktop\TravelBuddy\server\db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';
import type { IStorage } from './storage';
import type {
  User, InsertUser,
  Category, InsertCategory,
  Tour, InsertTour,
  Booking, InsertBooking,
  CustomRequest, InsertCustomRequest,
  Product, InsertProduct,
  Order, InsertOrder,
  BlogPost, InsertBlogPost,
  Testimonial, InsertTestimonial,
  Newsletter, InsertNewsletter
} from '@shared/schema';
import { eq, like, and } from 'drizzle-orm';

// Charger les variables d'environnement
dotenv.config();

// Vérifier que l'URL de la base de données est définie
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL n\'est pas défini dans les variables d\'environnement');
}

// Créer le client postgres
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { max: 1 });

// Créer l'instance de Drizzle
export const db = drizzle(client, { schema });

// Fonction pour tester la connexion à la base de données
export const testConnection = async () => {
  try {
    // Exécuter une requête simple pour vérifier la connexion
    await client`SELECT 1`;
    console.log('✅ Connexion à PostgreSQL établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à PostgreSQL:', error);
    return false;
  }
};

// Implémentation de IStorage avec PostgreSQL
export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(schema.categories);
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(schema.categories).where(eq(schema.categories.id, id));
    return result[0];
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(schema.categories).values(category).returning();
    return result[0];
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(schema.categories)
      .set(category)
      .where(eq(schema.categories.id, id))
      .returning();
    return result[0];
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(schema.categories).where(eq(schema.categories.id, id));
    return result.count > 0;
  }
  
  // Tour methods
  async getTours(): Promise<Tour[]> {
    return await db.select().from(schema.tours);
  }
  
  async getFeaturedTours(limit: number = 6): Promise<Tour[]> {
    return await db.select().from(schema.tours).where(eq(schema.tours.featured, true)).limit(limit);
  }
  
  async getToursByCategory(categoryId: number): Promise<Tour[]> {
    return await db.select().from(schema.tours).where(eq(schema.tours.categoryId, categoryId));
  }
  
  async getTour(id: number): Promise<Tour | undefined> {
    const result = await db.select().from(schema.tours).where(eq(schema.tours.id, id));
    return result[0];
  }
  
  async createTour(tour: InsertTour): Promise<Tour> {
    const result = await db.insert(schema.tours).values(tour).returning();
    return result[0];
  }
  
  async updateTour(id: number, tour: Partial<InsertTour>): Promise<Tour | undefined> {
    const result = await db.update(schema.tours)
      .set(tour)
      .where(eq(schema.tours.id, id))
      .returning();
    return result[0];
  }
  
  async deleteTour(id: number): Promise<boolean> {
    const result = await db.delete(schema.tours).where(eq(schema.tours.id, id));
    return result.count > 0;
  }
  
  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(schema.bookings);
  }
  
  async getBookingsByTourId(tourId: number): Promise<Booking[]> {
    return await db.select().from(schema.bookings).where(eq(schema.bookings.tourId, tourId));
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(schema.bookings).where(eq(schema.bookings.id, id));
    return result[0];
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(schema.bookings).values(booking).returning();
    return result[0];
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const result = await db.update(schema.bookings)
      .set({ status })
      .where(eq(schema.bookings.id, id))
      .returning();
    return result[0];
  }
  
  // Custom Request methods
  async getCustomRequests(): Promise<CustomRequest[]> {
    return await db.select().from(schema.customRequests);
  }
  
  async getCustomRequest(id: number): Promise<CustomRequest | undefined> {
    const result = await db.select().from(schema.customRequests).where(eq(schema.customRequests.id, id));
    return result[0];
  }
  
  async createCustomRequest(request: InsertCustomRequest): Promise<CustomRequest> {
    const result = await db.insert(schema.customRequests).values(request).returning();
    return result[0];
  }
  
  async updateCustomRequestStatus(id: number, status: string): Promise<CustomRequest | undefined> {
    const result = await db.update(schema.customRequests)
      .set({ status })
      .where(eq(schema.customRequests.id, id))
      .returning();
    return result[0];
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(schema.products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(schema.products).where(eq(schema.products.id, id));
    return result[0];
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(schema.products).where(eq(schema.products.category, category));
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(schema.products).values(product).returning();
    return result[0];
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(schema.products)
      .set(product)
      .where(eq(schema.products.id, id))
      .returning();
    return result[0];
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(schema.products).where(eq(schema.products.id, id));
    return result.count > 0;
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(schema.orders);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    return result[0];
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(schema.orders).values(order).returning();
    return result[0];
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await db.update(schema.orders)
      .set({ status })
      .where(eq(schema.orders.id, id))
      .returning();
    return result[0];
  }
  
  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(schema.blogPosts);
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return result[0];
  }
  
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.category, category));
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(schema.blogPosts).values(post).returning();
    return result[0];
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(schema.blogPosts)
      .set(post)
      .where(eq(schema.blogPosts.id, id))
      .returning();
    return result[0];
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return result.count > 0;
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(schema.testimonials);
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(schema.testimonials).values(testimonial).returning();
    return result[0];
  }
  
  // Newsletter methods
  async addNewsletterSubscription(newsletter: InsertNewsletter): Promise<Newsletter> {
    const result = await db.insert(schema.newsletters).values(newsletter).returning();
    return result[0];
  }
}