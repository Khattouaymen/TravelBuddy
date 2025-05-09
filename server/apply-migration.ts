// Ce script applique manuellement la migration pour ajouter les colonnes manquantes
import { db } from './db';
import { sql } from 'drizzle-orm';

async function applyMigration() {
  try {
    console.log('Début de la migration...');
    
    // Exécuter la requête SQL pour ajouter la colonne duration_days si elle n'existe pas
    await db.execute(sql`ALTER TABLE "custom_requests" ADD COLUMN IF NOT EXISTS "duration_days" integer;`);
    console.log('✅ Colonne "duration_days" ajoutée ou déjà existante.');
    
    // Exécuter la requête SQL pour ajouter la colonne phone si elle n'existe pas
    await db.execute(sql`ALTER TABLE "custom_requests" ADD COLUMN IF NOT EXISTS "phone" text;`);
    console.log('✅ Colonne "phone" ajoutée ou déjà existante.');
    
    console.log('✅ Migration réussie! Toutes les colonnes ont été ajoutées à la table "custom_requests".');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    process.exit(0);
  }
}

applyMigration();