import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import productsRoutes from './products.routes.js';
import categoriesRoutes from './categories.routes.js';
import subcategoriesRoutes from './subcategories.routes.js';
import brandsRoutes from './brands.routes.js';
import sectorsRoutes from './sectors.routes.js';
import blogsRoutes from './blogs.routes.js';
import quotesRoutes from './quotes.routes.js';
import salesRoutes from './sales.js';
import customerRoutes from './customer.routes.js';
import adminRoutes from '../admin/index.js';

const router = Router();

// Health check
router.use(healthRoutes);

// Public API routes
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/subcategories', subcategoriesRoutes);
router.use('/brands', brandsRoutes);
router.use('/sectors', sectorsRoutes);
router.use('/blogs', blogsRoutes);
router.use('/quotes', quotesRoutes);

// Sales Stats (Protected)
router.use('/sales', salesRoutes);

// Customer Dashboard routes (Protected)
router.use(customerRoutes);

// Admin routes
router.use('/admin', adminRoutes);

export default router;
