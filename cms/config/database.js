import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: env.databaseUrl
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
  process.exit(-1);
});
