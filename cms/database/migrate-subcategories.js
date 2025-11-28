import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateSubcategories() {
  console.log('🚀 Running subcategories migration...\n');
  
  const migrationFile = path.join(__dirname, 'migrations', '003_create_subcategories.sql');
  const sql = fs.readFileSync(migrationFile, 'utf8');
  
  try {
    await pool.query(sql);
    console.log('✅ Subcategories migration completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateSubcategories().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
