// filepath: c:\Users\Pavilion\Desktop\TravelBuddy\server\migrate-data.ts
import { storage as memStorage } from './storage';
import { PostgresStorage, db, testConnection } from './db';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function migrateData() {
  try {
    console.log('🔄 Démarrage de la migration des données vers PostgreSQL...');
    
    // Tester la connexion à PostgreSQL
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Impossible de se connecter à PostgreSQL. Vérifiez vos paramètres de connexion.');
      process.exit(1);
    }
    
    const pgStorage = new PostgresStorage();
    
    // 1. Migrer l'utilisateur admin
    console.log('🔄 Migration des utilisateurs...');
    const adminUser = await memStorage.getUserByUsername('admin');
    if (adminUser) {
      try {
        await pgStorage.createUser({
          username: adminUser.username,
          password: adminUser.password,
          email: adminUser.email,
          isAdmin: adminUser.isAdmin
        });
        console.log('✅ Utilisateur admin migré avec succès.');
      } catch (error) {
        console.log('⚠️ L\'utilisateur admin existe peut-être déjà dans la base de données.');
      }
    }
    
    // 2. Migrer les catégories
    console.log('🔄 Migration des catégories...');
    const categories = await memStorage.getCategories();
    for (const category of categories) {
      try {
        await pgStorage.createCategory({
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl
        });
        console.log(`✅ Catégorie "${category.name}" migrée avec succès.`);
      } catch (error) {
        console.log(`⚠️ Erreur lors de la migration de la catégorie "${category.name}".`);
      }
    }
    
    // 3. Migrer les circuits touristiques
    console.log('🔄 Migration des circuits touristiques...');
    const tours = await memStorage.getTours();
    for (const tour of tours) {
      try {
        await pgStorage.createTour({
          title: tour.title,
          description: tour.description,
          shortDescription: tour.shortDescription,
          imageUrl: tour.imageUrl,
          duration: tour.duration,
          price: tour.price,
          locations: tour.locations,
          featured: tour.featured,
          categoryId: tour.categoryId,
          rating: tour.rating || 0,
          reviewCount: tour.reviewCount || 0,
          tourPlan: tour.tourPlan,
          mapPoints: tour.mapPoints
        });
        console.log(`✅ Circuit "${tour.title}" migré avec succès.`);
      } catch (error) {
        console.log(`⚠️ Erreur lors de la migration du circuit "${tour.title}".`, error);
      }
    }
    
    // 4. Migrer les produits
    console.log('🔄 Migration des produits...');
    const products = await memStorage.getProducts();
    for (const product of products) {
      try {
        await pgStorage.createProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          isNew: product.isNew,
          inStock: product.inStock,
          discountPrice: product.discountPrice
        });
        console.log(`✅ Produit "${product.name}" migré avec succès.`);
      } catch (error) {
        console.log(`⚠️ Erreur lors de la migration du produit "${product.name}".`);
      }
    }
    
    // 5. Migrer les articles de blog
    console.log('🔄 Migration des articles de blog...');
    const blogPosts = await memStorage.getBlogPosts();
    for (const post of blogPosts) {
      try {
        await pgStorage.createBlogPost({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          imageUrl: post.imageUrl,
          category: post.category,
          publishDate: post.publishDate,
          author: post.author
        });
        console.log(`✅ Article de blog "${post.title}" migré avec succès.`);
      } catch (error) {
        console.log(`⚠️ Erreur lors de la migration de l'article de blog "${post.title}".`);
      }
    }
    
    // 6. Migrer les témoignages
    console.log('🔄 Migration des témoignages...');
    const testimonials = await memStorage.getTestimonials();
    for (const testimonial of testimonials) {
      try {
        await pgStorage.createTestimonial({
          name: testimonial.name,
          country: testimonial.country,
          avatar: testimonial.avatar,
          rating: testimonial.rating,
          comment: testimonial.comment
        });
        console.log(`✅ Témoignage de "${testimonial.name}" migré avec succès.`);
      } catch (error) {
        console.log(`⚠️ Erreur lors de la migration du témoignage de "${testimonial.name}".`);
      }
    }
    
    console.log('✅ Migration terminée avec succès !');
    console.log('Vous pouvez maintenant modifier routes.ts pour utiliser PostgresStorage.');
    
  } catch (error) {
    console.error('❌ Erreur durant la migration :', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter la migration
migrateData();