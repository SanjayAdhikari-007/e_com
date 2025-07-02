// src/controllers/category.controller.ts
import { Request, Response } from 'express';
import {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryByName
} from '../services/category.service';
import { Category } from '../entities/category';

export const createCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryData: Omit<Category, 'id' | 'createdAt'> = req.body;
    const newCategory = await createCategory(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

export const getCategoryByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve category', error });
  }
};

export const getCategoryByNameHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.params;
    const category = await getCategoryByName(name);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve category', error });
  }
};

export const getAllCategoriesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve categories', error });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const categoryData: Partial<Omit<Category, 'id' | 'createdAt'>> = req.body;
    const updatedCategory = await updateCategory(id, categoryData);
    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error });
  }
};