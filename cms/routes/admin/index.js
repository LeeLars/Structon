import { Router } from 'express';
import usersRoutes from './users.routes.js';
import productsRoutes from './products.routes.js';
import pricesRoutes from './prices.routes.js';
import categoriesRoutes from './categories.routes.js';
import subcategoriesRoutes from './subcategories.routes.js';
import brandsRoutes from './brands.routes.js';
import sectorsRoutes from './sectors.routes.js';
import seedRoutes from './seed.routes.js';

const router = Router();

router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/prices', pricesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/subcategories', subcategoriesRoutes);
router.use('/brands', brandsRoutes);
router.use('/sectors', sectorsRoutes);
router.use('/seed', seedRoutes);

export default router;
