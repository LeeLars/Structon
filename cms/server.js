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
      // Ignore "already exists" errors
      if (error.message.includes('already exists')) {
        console.log(`   ⏭️  ${file} (already applied)`);
      } else {
        console.error(`   ❌ Error in ${file}:`, error.message);
        throw error;
      }
    }
  }

  console.log('✅ Database migrations complete\n');
}

const app = express();

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  'https://leelars.github.io',
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

// Compression middleware - compress all responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Balance between speed and compression ratio
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Cache control middleware
app.use((req, res, next) => {
  // API responses - short cache for dynamic content
  if (req.path.startsWith('/api/')) {
    // Public API endpoints can be cached briefly
    if (req.path.includes('/products') || req.path.includes('/categories') || req.path.includes('/subcategories')) {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // 5min client, 10min CDN
    } else {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
  // Static files - long cache
  else if (req.path.startsWith('/cms/')) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
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
