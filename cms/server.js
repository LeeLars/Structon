import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import apiRoutes from './routes/api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
app.use(cors({
  origin: env.frontendUrl,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

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

app.listen(env.port, () => {
  console.log(`🚀 Structon CMS draait op poort ${env.port}`);
});
