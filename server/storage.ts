import {
  type User, type InsertUser, 
  type Category, type InsertCategory,
  type Tour, type InsertTour,
  type Booking, type InsertBooking,
  type CustomRequest, type InsertCustomRequest,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type BlogPost, type InsertBlogPost,
  type Testimonial, type InsertTestimonial,
  type Newsletter, type InsertNewsletter
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Tour methods
  getTours(): Promise<Tour[]>;
  getFeaturedTours(limit?: number): Promise<Tour[]>;
  getToursByCategory(categoryId: number): Promise<Tour[]>;
  getTour(id: number): Promise<Tour | undefined>;
  createTour(tour: InsertTour): Promise<Tour>;
  updateTour(id: number, tour: Partial<InsertTour>): Promise<Tour | undefined>;
  deleteTour(id: number): Promise<boolean>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBookingsByTourId(tourId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Custom Request methods
  getCustomRequests(): Promise<CustomRequest[]>;
  getCustomRequest(id: number): Promise<CustomRequest | undefined>;
  createCustomRequest(request: InsertCustomRequest): Promise<CustomRequest>;
  updateCustomRequestStatus(id: number, status: string): Promise<CustomRequest | undefined>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Newsletter methods
  addNewsletterSubscription(email: InsertNewsletter): Promise<Newsletter>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private tours: Map<number, Tour>;
  private bookings: Map<number, Booking>;
  private customRequests: Map<number, CustomRequest>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private blogPosts: Map<number, BlogPost>;
  private testimonials: Map<number, Testimonial>;
  private newsletters: Map<number, Newsletter>;
  
  private userCounter: number;
  private categoryCounter: number;
  private tourCounter: number;
  private bookingCounter: number;
  private customRequestCounter: number;
  private productCounter: number;
  private orderCounter: number;
  private blogPostCounter: number;
  private testimonialCounter: number;
  private newsletterCounter: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.tours = new Map();
    this.bookings = new Map();
    this.customRequests = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.blogPosts = new Map();
    this.testimonials = new Map();
    this.newsletters = new Map();
    
    this.userCounter = 1;
    this.categoryCounter = 1;
    this.tourCounter = 1;
    this.bookingCounter = 1;
    this.customRequestCounter = 1;
    this.productCounter = 1;
    this.orderCounter = 1;
    this.blogPostCounter = 1;
    this.testimonialCounter = 1;
    this.newsletterCounter = 1;
    
    // Initialize with an admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@marocvoyages.com",
      isAdmin: true
    });
    
    // Add initial categories
    const categories = [
      { name: "Plages", description: "Découvrez les magnifiques plages du Maroc", imageUrl: "https://images.unsplash.com/photo-1565689876697-e467b6c54da2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
      { name: "Montagnes", description: "Explorez les chaînes montagneuses du Maroc", imageUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
      { name: "Désert", description: "Vivez une expérience unique dans le désert marocain", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
      { name: "Villes impériales", description: "Visitez les villes impériales chargées d'histoire", imageUrl: "https://images.unsplash.com/photo-1560240284-fc66b7a23bf0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
    ];
    
    categories.forEach(cat => this.createCategory(cat));
    
    // Add initial tours
    const tours = [
      {
        title: "Marrakech et Essaouira",
        description: "Découvrez la magie de la ville rouge et les brises de l'Atlantique lors de ce circuit de 5 jours entre Marrakech et Essaouira. Vous visiterez les jardins Majorelle, la médina de Marrakech, la place Jemaa el-Fna et découvrirez l'ambiance portuaire d'Essaouira.",
        shortDescription: "Découvrez la magie de la ville rouge et les brises de l'Atlantique",
        imageUrl: "https://images.unsplash.com/photo-1548018560-c7196548fcd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        duration: 5,
        price: 4900,
        locations: "Marrakech, Essaouira",
        featured: true,
        categoryId: 4,
        rating: 4.8,
        reviewCount: 24,
        tourPlan: [
          { day: 1, title: "Arrivée à Marrakech", description: "Accueil à l'aéroport et transfert à votre riad. Temps libre pour explorer les environs." },
          { day: 2, title: "Découverte de Marrakech", description: "Visite guidée des principaux sites de Marrakech: Jardins Majorelle, Palais Bahia, Médersa Ben Youssef." },
          { day: 3, title: "Souk et gastronomie", description: "Exploration des souks de Marrakech et cours de cuisine marocaine." },
          { day: 4, title: "Route vers Essaouira", description: "Départ pour Essaouira. En chemin, visite d'une coopérative d'huile d'argan." },
          { day: 5, title: "Essaouira et retour", description: "Découverte d'Essaouira et de son port. Retour à Marrakech dans l'après-midi." }
        ],
        mapPoints: [
          { lat: 31.6295, lng: -7.9811, title: "Marrakech" },
          { lat: 31.5085, lng: -9.7592, title: "Essaouira" }
        ]
      },
      {
        title: "Expédition du désert",
        description: "Vivez une expérience inoubliable dans les dunes du Sahara avec ce circuit de 7 jours qui vous mènera de Marrakech au désert de Merzouga. Vous traverserez les montagnes de l'Atlas, visiterez les kasbahs, et passerez une nuit sous les étoiles dans un campement nomade.",
        shortDescription: "Vivez une expérience inoubliable dans les dunes du Sahara",
        imageUrl: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        duration: 7,
        price: 7500,
        locations: "Merzouga, Erg Chebbi",
        featured: true,
        categoryId: 3,
        rating: 4.9,
        reviewCount: 36,
        tourPlan: [
          { day: 1, title: "Départ de Marrakech", description: "Route vers Ouarzazate en traversant le col de Tizi n'Tichka." },
          { day: 2, title: "Ouarzazate et Vallée du Dadès", description: "Visite de la Kasbah d'Aït Ben Haddou et route vers les gorges du Dadès." },
          { day: 3, title: "Gorges du Todra", description: "Exploration des impressionnantes gorges du Todra et continuation vers Merzouga." },
          { day: 4, title: "Désert de Merzouga", description: "Balade à dos de dromadaire et nuit dans un campement berbère au milieu des dunes." },
          { day: 5, title: "Villages berbères", description: "Découverte des villages berbères et de leur mode de vie." },
          { day: 6, title: "Vallée du Drâa", description: "Traversée de la vallée du Drâa et ses palmeraies." },
          { day: 7, title: "Retour à Marrakech", description: "Dernier jour de route pour rejoindre Marrakech. Fin du circuit." }
        ],
        mapPoints: [
          { lat: 31.6295, lng: -7.9811, title: "Marrakech" },
          { lat: 30.9335, lng: -6.9370, title: "Ouarzazate" },
          { lat: 31.3757, lng: -4.0148, title: "Merzouga" }
        ]
      },
      {
        title: "La perle bleue",
        description: "Explorez les ruelles colorées de Chefchaouen, surnommée la perle bleue du Maroc, lors de ce circuit de 3 jours. Vous découvrirez cette ville unique aux maisons bleues nichée dans les montagnes du Rif, et visiterez également Tétouan.",
        shortDescription: "Explorez les ruelles colorées de Chefchaouen",
        imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        duration: 3,
        price: 3200,
        locations: "Chefchaouen, Tétouan",
        featured: true,
        categoryId: 2,
        rating: 4.7,
        reviewCount: 19,
        tourPlan: [
          { day: 1, title: "Arrivée à Tanger", description: "Accueil à l'aéroport de Tanger et transfert à Chefchaouen." },
          { day: 2, title: "Découverte de Chefchaouen", description: "Journée complète pour explorer la médina bleue, la place Outa el Hammam et la source Ras el-Ma." },
          { day: 3, title: "Tétouan et départ", description: "Visite de Tétouan, classée au patrimoine mondial de l'UNESCO, avant le retour." }
        ],
        mapPoints: [
          { lat: 35.7633, lng: -5.8333, title: "Tanger" },
          { lat: 35.1683, lng: -5.2684, title: "Chefchaouen" },
          { lat: 35.5727, lng: -5.3728, title: "Tétouan" }
        ]
      }
    ];
    
    tours.forEach(tour => this.createTour(tour));
    
    // Add initial products
    const products = [
      {
        name: "Tapis berbère",
        description: "Tapis fait main avec motifs traditionnels des montagnes de l'Atlas. Chaque pièce est unique et tissée par des artisans berbères.",
        price: 1200,
        imageUrl: "https://images.unsplash.com/photo-1553659971-f01207815908?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "artisanat",
        isNew: true,
        inStock: true
      },
      {
        name: "Théière en cuivre",
        description: "Théière traditionnelle ciselée à la main par des artisans de Fès. Parfaite pour préparer le thé à la menthe marocain.",
        price: 450,
        imageUrl: "https://images.unsplash.com/photo-1609604818864-8103bd9d8427?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "ustensiles",
        isNew: false,
        inStock: true
      },
      {
        name: "Lampe marocaine",
        description: "Lampe en métal ciselé avec verre coloré, fabriquée artisanalement à Marrakech. Crée une ambiance chaleureuse avec ses jeux d'ombre et de lumière.",
        price: 680,
        imageUrl: "https://images.unsplash.com/photo-1582729780596-6b73c3f73559?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "décoration",
        isNew: false,
        inStock: true
      },
      {
        name: "Poterie de Safi",
        description: "Plat décoratif en céramique peint à la main par les artisans de Safi, ville réputée pour sa poterie.",
        price: 320,
        discountPrice: 400,
        imageUrl: "https://images.unsplash.com/photo-1579642761360-eabd8001c3e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "décoration",
        isNew: false,
        inStock: true
      }
    ];
    
    products.forEach(product => this.createProduct(product));
    
    // Add initial blog posts
    const blogPosts = [
      {
        title: "10 incontournables à Marrakech",
        content: "Marrakech, surnommée la ville rouge, est une destination incontournable au Maroc...",
        excerpt: "Découvrez les sites et expériences à ne pas manquer lors de votre visite dans la ville rouge.",
        imageUrl: "https://images.unsplash.com/photo-1549140600-78c9b8275e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Destinations",
        publishDate: new Date("2023-05-12"),
        author: "Sophie Durand"
      },
      {
        title: "Guide de la cuisine marocaine",
        content: "La cuisine marocaine est l'une des plus riches et des plus diversifiées au monde...",
        excerpt: "Les plats traditionnels à goûter absolument lors de votre séjour au Maroc.",
        imageUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Gastronomie",
        publishDate: new Date("2023-06-05"),
        author: "Mohammed Alami"
      },
      {
        title: "Conseils pour un trek dans l'Atlas",
        content: "Les montagnes de l'Atlas offrent parmi les plus beaux paysages du Maroc et d'excellentes opportunités de randonnée...",
        excerpt: "Préparez-vous pour une randonnée dans les montagnes de l'Atlas avec nos conseils d'experts.",
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "Aventure",
        publishDate: new Date("2023-05-20"),
        author: "Karim Benali"
      }
    ];
    
    blogPosts.forEach(post => this.createBlogPost(post));
    
    // Add initial testimonials
    const testimonials = [
      {
        name: "Sophie M.",
        country: "France",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        rating: 5,
        comment: "Notre voyage à travers le désert était magique ! Notre guide était incroyable et nous a fait découvrir des endroits hors des sentiers battus. Je recommande vivement cette expérience !"
      },
      {
        name: "Marco T.",
        country: "Italie",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        rating: 4,
        comment: "Circuit parfaitement organisé de Marrakech à Fès. Les riads étaient magnifiques et l'accueil chaleureux. Merci pour cette découverte approfondie de la culture marocaine !"
      },
      {
        name: "Julia K.",
        country: "Allemagne",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        comment: "Notre voyage personnalisé était exactement ce que nous recherchions. L'équipe a été très réactive et a adapté l'itinéraire à nos envies. Les souvenirs achetés dans la boutique sont superbes !"
      }
    ];
    
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Tour methods
  async getTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }
  
  async getFeaturedTours(limit: number = 6): Promise<Tour[]> {
    return Array.from(this.tours.values())
      .filter(tour => tour.featured)
      .slice(0, limit);
  }
  
  async getToursByCategory(categoryId: number): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => tour.categoryId === categoryId);
  }
  
  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }
  
  async createTour(insertTour: InsertTour): Promise<Tour> {
    const id = this.tourCounter++;
    const tour: Tour = { ...insertTour, id, rating: 0, reviewCount: 0 };
    this.tours.set(id, tour);
    return tour;
  }
  
  async updateTour(id: number, tourData: Partial<InsertTour>): Promise<Tour | undefined> {
    const tour = this.tours.get(id);
    if (!tour) return undefined;
    
    const updatedTour = { ...tour, ...tourData };
    this.tours.set(id, updatedTour);
    return updatedTour;
  }
  
  async deleteTour(id: number): Promise<boolean> {
    return this.tours.delete(id);
  }
  
  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
  
  async getBookingsByTourId(tourId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.tourId === tourId);
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingCounter++;
    const now = new Date();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      status: "pending", 
      createdAt: now 
    };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Custom Request methods
  async getCustomRequests(): Promise<CustomRequest[]> {
    return Array.from(this.customRequests.values());
  }
  
  async getCustomRequest(id: number): Promise<CustomRequest | undefined> {
    return this.customRequests.get(id);
  }
  
  async createCustomRequest(insertRequest: InsertCustomRequest): Promise<CustomRequest> {
    const id = this.customRequestCounter++;
    const now = new Date();
    const request: CustomRequest = { 
      ...insertRequest, 
      id, 
      status: "new", 
      createdAt: now 
    };
    this.customRequests.set(id, request);
    return request;
  }
  
  async updateCustomRequestStatus(id: number, status: string): Promise<CustomRequest | undefined> {
    const request = this.customRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, status };
    this.customRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCounter++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending", 
      createdAt: now 
    };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.category === category);
  }
  
  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCounter++;
    const now = new Date();
    const post: BlogPost = { 
      ...insertPost, 
      id, 
      publishDate: now 
    };
    this.blogPosts.set(id, post);
    return post;
  }
  
  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...postData };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCounter++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  // Newsletter methods
  async addNewsletterSubscription(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = this.newsletterCounter++;
    const now = new Date();
    const newsletter: Newsletter = { 
      ...insertNewsletter, 
      id, 
      createdAt: now 
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }
}

export const storage = new MemStorage();
