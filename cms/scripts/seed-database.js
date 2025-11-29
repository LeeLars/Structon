/**
 * Manual Database Seeding Script
 * Run this to populate the database with demo data
 * Usage: node cms/scripts/seed-database.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');
  
  try {
    // Read the seed SQL file
    const seedSQL = fs.readFileSync(
      join(__dirname, '../database/migrations/007_seed_demo_data.sql'),
      'utf8'
    );
    
    console.log('📄 Executing seed SQL...');
    await pool.query(seedSQL);
    
    console.log('\n✅ Database seeded successfully!');
    
    // Verify data
    const categoriesResult = await pool.query('SELECT COUNT(*) FROM categories');
    const brandsResult = await pool.query('SELECT COUNT(*) FROM brands');
    const productsResult = await pool.query('SELECT COUNT(*) FROM products');
    
    console.log('\n📊 Database contents:');
    console.log(`   Categories: ${categoriesResult.rows[0].count}`);
    console.log(`   Brands: ${brandsResult.rows[0].count}`);
    console.log(`   Products: ${productsResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
