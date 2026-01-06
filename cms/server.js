import express from 'express';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { pool } from './config/database.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import apiRoutes from './routes/api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log startup info
console.log('🚀 Starting Structon CMS...');
console.log(`📍 Environment: ${env.nodeEnv}`);
console.log(`🔌 Port: ${env.port}`);
console.log(`🗄️  Database URL: ${env.databaseUrl ? 'configured' : '❌ MISSING'}`);

/**
 * Run database migrations automatically on startup
 * Uses _migrations table to track which migrations have been applied
 * This ensures migrations only run ONCE, not on every restart
 */
async function runMigrations() {
  // Skip if no database pool
  if (!pool) {
    console.log('⏭️  Skipping migrations - no database configured');
    return;
  }

  console.log('🔄 Checking database migrations...');
  
  // First, ensure the migrations tracking table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Get list of already applied migrations
  const appliedResult = await pool.query('SELECT name FROM _migrations');
  const appliedMigrations = new Set(appliedResult.rows.map(r => r.name));
  
  const migrationsDir = path.join(__dirname, 'database', 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  let newMigrations = 0;
  
  for (const file of files) {
    // Skip if already applied
    if (appliedMigrations.has(file)) {
      console.log(`   ⏭️  ${file} (already applied)`);
      continue;
    }
    
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    try {
      await pool.query(sql);
      // Record that this migration was applied
      await pool.query('INSERT INTO _migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [file]);
      console.log(`   ✅ ${file}`);
      newMigrations++;
    } catch (error) {
      // Ignore "already exists" errors and duplicate key errors
      if (error.message.includes('already exists') || 
          error.message.includes('duplicate key')) {
        // Still record it as applied
        await pool.query('INSERT INTO _migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [file]);
        console.log(`   ⏭️  ${file} (already applied)`);
      } else {
        console.error(`   ❌ Error in ${file}:`, error.message);
        // Don't throw - continue with other migrations
      }
    }
  }

  if (newMigrations > 0) {
    console.log(`✅ Applied ${newMigrations} new migration(s)\n`);
  } else {
    console.log('✅ Database schema is up to date\n');
  }
  
  // Check database status
  await checkAndSeedDatabase();
}

/**
 * Check database status (no more auto-seeding)
 * All data must come from CMS admin panel
 */
async function checkAndSeedDatabase() {
  // Skip if no database pool
  if (!pool) {
    console.log('⏭️  Skipping database check - no database configured');
    return;
  }

  try {
    const [cats, brands, prods] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM categories'),
      pool.query('SELECT COUNT(*) FROM brands'),
      pool.query('SELECT COUNT(*) FROM products')
    ]);
    
    console.log('📊 Database Status:');
    console.log(`   📁 Categories: ${cats.rows[0].count}`);
    console.log(`   🏷️  Brands: ${brands.rows[0].count}`);
    console.log(`   📦 Products: ${prods.rows[0].count}`);
    
    if (parseInt(prods.rows[0].count) === 0) {
      console.log('\n⚠️  Database is empty! Add products via CMS admin panel.\n');
    } else {
      console.log('');
    }
  } catch (error) {
    console.error('⚠️  Could not check database:', error.message);
  }
}

const app = express();

// Trust proxy for Railway (needed for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  'https://leelars.github.io',
  'https://structon-production.up.railway.app',
  'https://structon.up.railway.app',
  env.frontendUrl
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin starts with any allowed origin
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Compression middleware - compress all responses (optimized)
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balance between speed and compression ratio
  threshold: 1024, // Only compress responses > 1KB
  memLevel: 8 // Use more memory for better compression
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Cache control middleware (optimized)
app.use((req, res, next) => {
  // API responses - tiered caching strategy
  if (req.path.startsWith('/api/')) {
    // Public read-only endpoints - aggressive caching
    if (req.method === 'GET') {
      if (req.path.includes('/products') || req.path.includes('/categories') || req.path.includes('/brands') || req.path.includes('/subcategories')) {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400'); // 5min client, 10min CDN, 24h stale
        res.set('Vary', 'Accept-Encoding');
      } else if (req.path.includes('/navigation')) {
        res.set('Cache-Control', 'public, max-age=600, s-maxage=1800'); // 10min client, 30min CDN
      } else {
        res.set('Cache-Control', 'private, no-cache');
      }
    } else {
      // POST/PUT/DELETE - no cache
      res.set('Cache-Control', 'no-store');
    }
  }
  // Static CMS files - shorter cache during development
  else if (req.path.startsWith('/cms/')) {
    if (req.path.match(/\.(js|css)$/)) {
      res.set('Cache-Control', 'no-cache, must-revalidate'); // No cache for JS/CSS during development
    } else if (req.path.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
      res.set('Cache-Control', 'public, max-age=86400'); // 1 day for images/fonts
    } else {
      res.set('Cache-Control', 'no-cache'); // No cache for HTML
    }
  }
  next();
});

// Rate limiting for API
app.use('/api', apiLimiter);

// API routes
app.use('/api', apiRoutes);

// Admin static files
app.use('/cms', express.static(path.join(__dirname, 'public')));

// Root test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Structon CMS API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      brands: '/api/brands',
      sectors: '/api/sectors',
      auth: '/api/auth',
      admin: '/api/admin'
    }
  });
});

app.use(errorHandler);

// Start server with migrations
async function startServer() {
  try {
    // Check if DATABASE_URL is configured
    if (!env.databaseUrl) {
      console.error('❌ DATABASE_URL is not configured!');
      console.log('⚠️  Starting server without database connection...');
      
      // Start server anyway for health checks
      app.listen(env.port, '0.0.0.0', () => {
        console.log(`🚀 Structon CMS draait op poort ${env.port} (NO DATABASE)`);
      });
      return;
    }

    // Test database connection first
    console.log('🔗 Testing database connection...');
    try {
      await pool.query('SELECT 1');
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      console.log('⚠️  Starting server anyway - some features may not work');
    }

    // Run migrations
    await runMigrations();
    
    // Start the server - bind to 0.0.0.0 for Railway
    app.listen(env.port, '0.0.0.0', () => {
      console.log(`🚀 Structon CMS draait op poort ${env.port}`);
      console.log(`📡 Server bound to 0.0.0.0:${env.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    
    // Try to start server anyway for debugging
    try {
      app.listen(env.port, '0.0.0.0', () => {
        console.log(`🚀 Server started on port ${env.port} (with errors)`);
      });
    } catch (listenError) {
      console.error('❌ Could not start server:', listenError);
      process.exit(1);
    }
  }
}

startServer();
