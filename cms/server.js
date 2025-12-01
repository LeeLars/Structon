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

/**
 * Run database migrations automatically on startup
 */
async function runMigrations() {
  console.log('🔄 Checking database migrations...');
  
  const migrationsDir = path.join(__dirname, 'database', 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    try {
      await pool.query(sql);
      console.log(`   ✅ ${file}`);
    } catch (error) {
      // Ignore "already exists" errors and duplicate key errors
      if (error.message.includes('already exists') || 
          error.message.includes('duplicate key')) {
        console.log(`   ⏭️  ${file} (already applied)`);
      } else {
        console.error(`   ❌ Error in ${file}:`, error.message);
        // Don't throw - continue with other migrations
      }
    }
  }

  console.log('✅ Database migrations complete\n');
  
  // Check if database is empty and seed if needed
  await checkAndSeedDatabase();
}

/**
 * Check if database is empty and seed with demo data
 */
async function checkAndSeedDatabase() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM products');
    const productCount = parseInt(result.rows[0].count);
    
    if (productCount === 0) {
      console.log('📦 Database is empty, seeding with demo data...');
      
      const seedSQL = fs.readFileSync(
        path.join(__dirname, 'database', 'migrations', '007_seed_demo_data.sql'),
        'utf8'
      );
      
      await pool.query(seedSQL);
      
      // Verify
      const [cats, brands, prods] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM categories'),
        pool.query('SELECT COUNT(*) FROM brands'),
        pool.query('SELECT COUNT(*) FROM products')
      ]);
      
      console.log('✅ Demo data seeded successfully!');
      console.log(`   📁 Categories: ${cats.rows[0].count}`);
      console.log(`   🏷️  Brands: ${brands.rows[0].count}`);
      console.log(`   📦 Products: ${prods.rows[0].count}\n`);
    } else {
      console.log(`✅ Database already has ${productCount} products\n`);
    }
  } catch (error) {
    console.error('⚠️  Could not check/seed database:', error.message);
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
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
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
    // Run migrations first
    await runMigrations();
    
    // Then start the server
    app.listen(env.port, () => {
      console.log(`🚀 Structon CMS draait op poort ${env.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
