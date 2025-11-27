import { Router } from 'express';
import usersRoutes from './users.routes.js';
import productsRoutes from './products.routes.js';
import pricesRoutes from './prices.routes.js';
import categoriesRoutes from './categories.routes.js';
import brandsRoutes from './brands.routes.js';
import sectorsRoutes from './sectors.routes.js';

const router = Router();

router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/prices', pricesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/brands', brandsRoutes);
router.use('/sectors', sectorsRoutes);

export default router;
