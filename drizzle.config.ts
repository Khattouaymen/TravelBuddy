import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// URL directe avec les identifiants corrects
const DATABASE_URL = "postgresql://admin:AYMENADMIN@4.211.189.215:5432/travelbuddy";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
