/**
 * Create Admin User Script
 * Usage: node scripts/create-admin.js
 */

import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('\n🔐 Structon CMS - Admin Account Aanmaken\n');

  try {
    // Get email
    const email = await question('Email adres (bijv. admin@structon.nl): ');
    if (!email || !email.includes('@')) {
      console.error('❌ Ongeldig email adres');
      process.exit(1);
    }

    // Get password
    const password = await question('Wachtwoord (min. 8 tekens): ');
    if (!password || password.length < 8) {
      console.error('❌ Wachtwoord moet minimaal 8 tekens zijn');
      process.exit(1);
    }

    // Hash password
    console.log('\n⏳ Wachtwoord hashen...');
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert into database
    console.log('💾 Admin aanmaken in database...');
    const result = await pool.query(`
      INSERT INTO users (email, password_hash, role, is_active)
      VALUES ($1, $2, 'admin', true)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password_hash = $2,
        role = 'admin',
        is_active = true,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, email, role
    `, [email, passwordHash]);

    const user = result.rows[0];

    console.log('\n✅ Admin account succesvol aangemaakt!\n');
    console.log('📧 Email:', user.email);
    console.log('🔑 Role:', user.role);
    console.log('🆔 ID:', user.id);
    console.log('\n🌐 Login op: http://localhost:3000/cms/\n');

  } catch (error) {
    console.error('\n❌ Fout bij aanmaken admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

createAdmin();
