import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { PostgresStorage, testConnection } from "./db";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertCategorySchema, 
  insertTourSchema, 
  insertBookingSchema, 
  insertCustomRequestSchema, 
  insertProductSchema, 
  insertOrderSchema, 
  insertBlogPostSchema, 
  insertTestimonialSchema, 
  insertNewsletterSchema
} from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

// Créer une instance de PostgresStorage
const db = new PostgresStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Tester la connexion à PostgreSQL
  const connected = await testConnection();
  if (!connected) {
    console.error("❌ ERREUR CRITIQUE: Impossible de se connecter à PostgreSQL. L'application nécessite une connexion à la base de données pour fonctionner.");
    process.exit(1); // Arrêter l'application si la connexion à la base de données échoue
  } else {
    console.log("✅ Connexion à PostgreSQL établie avec succès");
  }
  
  // Session setup
  const MemoryStoreSession = MemoryStore(session);
  app.use(session({
    secret: "marocvoyages-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // 24h
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24h
    }
  }));
  
  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  const isAdmin = async (req: Request, res: Response, next: Function) => {
    if (req.session.user) {
      const user = await db.getUserByUsername(req.session.user);
      if (user && user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: "Forbidden - Admin rights required" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await db.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.user = user.username;
      
      res.json({ 
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/session", (req, res) => {
    if (req.session.user) {
      res.json({ isAuthenticated: true, username: req.session.user });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await db.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await db.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });
  
  app.post("/api/categories", isAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await db.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating category" });
    }
  });
  
  app.put("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await db.updateCategory(id, validatedData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating category" });
    }
  });
  
  app.delete("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await db.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  });
  
  // Tours routes
  app.get("/api/tours", async (req, res) => {
    try {
      const { featured, categoryId, limit } = req.query;
      
      let tours;
      
      if (featured === "true") {
        tours = await db.getFeaturedTours(limit ? parseInt(limit as string) : undefined);
      } else if (categoryId) {
        tours = await db.getToursByCategory(parseInt(categoryId as string));
      } else {
        tours = await db.getTours();
      }
      
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tours" });
    }
  });
  
  app.get("/api/tours/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tour = await db.getTour(id);
      
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      res.json(tour);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tour" });
    }
  });
  
  app.post("/api/tours", isAdmin, async (req, res) => {
    try {
      const validatedData = insertTourSchema.parse(req.body);
      const tour = await db.createTour(validatedData);
      res.status(201).json(tour);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating tour" });
    }
  });
  
  app.put("/api/tours/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTourSchema.partial().parse(req.body);
      const updatedTour = await db.updateTour(id, validatedData);
      
      if (!updatedTour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      res.json(updatedTour);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating tour" });
    }
  });
  
  app.delete("/api/tours/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await db.deleteTour(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      res.json({ message: "Tour deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting tour" });
    }
  });
  
  // Bookings routes
  app.get("/api/bookings", isAdmin, async (req, res) => {
    try {
      const bookings = await db.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });
  
  app.get("/api/bookings/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await db.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error fetching booking" });
    }
  });
  
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await db.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating booking" });
    }
  });
  
  app.put("/api/bookings/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedBooking = await db.updateBookingStatus(id, status);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Error updating booking status" });
    }
  });
  
  // Custom requests routes
  app.get("/api/custom-requests", isAdmin, async (req, res) => {
    try {
      const requests = await db.getCustomRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching custom requests" });
    }
  });
  
  app.get("/api/custom-requests/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await db.getCustomRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Custom request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Error fetching custom request" });
    }
  });
  
  app.post("/api/custom-requests", async (req, res) => {
    try {
      const validatedData = insertCustomRequestSchema.parse(req.body);
      const request = await db.createCustomRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating custom request" });
    }
  });
  
  app.put("/api/custom-requests/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["new", "in-progress", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedRequest = await db.updateCustomRequestStatus(id, status);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Custom request not found" });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Error updating custom request status" });
    }
  });
  
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      
      let products;
      
      if (category) {
        products = await db.getProductsByCategory(category as string);
      } else {
        products = await db.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await db.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });
  
  app.post("/api/products", isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await db.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });
  
  app.put("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await db.updateProduct(id, validatedData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  });
  
  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await db.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });
  
  // Orders routes
  app.get("/api/orders", isAdmin, async (req, res) => {
    try {
      const orders = await db.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  app.get("/api/orders/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await db.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });
  
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await db.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order" });
    }
  });
  
  app.put("/api/orders/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedOrder = await db.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Error updating order status" });
    }
  });
  
  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const { category } = req.query;
      
      let posts;
      
      if (category) {
        posts = await db.getBlogPostsByCategory(category as string);
      } else {
        posts = await db.getBlogPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });
  
  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await db.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });
  
  app.post("/api/blog", isAdmin, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await db.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating blog post" });
    }
  });
  
  app.put("/api/blog/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const updatedPost = await db.updateBlogPost(id, validatedData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating blog post" });
    }
  });
  
  app.delete("/api/blog/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await db.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting blog post" });
    }
  });
  
  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await db.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });
  
  app.post("/api/testimonials", isAdmin, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await db.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating testimonial" });
    }
  });
  
  // Newsletter routes
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const newsletter = await db.addNewsletterSubscription(validatedData);
      res.status(201).json(newsletter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding newsletter subscription" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
