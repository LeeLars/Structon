import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import productsRoutes from './products.routes.js';
import categoriesRoutes from './categories.routes.js';
import subcategoriesRoutes from './subcategories.routes.js';
import brandsRoutes from './brands.routes.js';
import sectorsRoutes from './sectors.routes.js';
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

// Admin routes
router.use('/admin', adminRoutes);

export default router;
