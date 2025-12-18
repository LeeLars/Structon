import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

// Create pool only if DATABASE_URL is configured
const poolConfig = env.databaseUrl ? {
  connectionString: env.databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection pool settings for Railway
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
} : null;

export const pool = poolConfig ? new Pool(poolConfig) : null;

export const query = async (text, params) => {
  if (!pool) {
    throw new Error('Database not configured - DATABASE_URL is missing');
  }
  return pool.query(text, params);
};

// Only attach error handler if pool exists
if (pool) {
  pool.on('error', (err) => {
    console.error('⚠️ Unexpected PG pool error:', err.message);
    // Don't exit - let the server continue running
  });
}
