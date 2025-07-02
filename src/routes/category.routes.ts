// src/routes/category.routes.ts
import express from 'express';
import {
  createCategoryHandler,
  getCategoryByIdHandler,
  getAllCategoriesHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  getCategoryByNameHandler
} from '../controllers/category.controller';

const router = express.Router();

router.post('/', createCategoryHandler);
router.get('/:id', getCategoryByIdHandler);
router.get('/name/:name', getCategoryByNameHandler);
router.get('/', getAllCategoriesHandler);
router.put('/:id', updateCategoryHandler);
router.delete('/:id', deleteCategoryHandler);

export default router;