// src/services/category.service.ts
import { Category } from '../entities/category';
import MongoCategoryRepository from '../interface-adapters/repositories/mongo/mongo-category-repository';

const categoryRepository = new MongoCategoryRepository();

export const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
  return categoryRepository.create({ ...categoryData });
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  return categoryRepository.getById(id);
};

export const getCategoryByName = async (name: string): Promise<Category | null> => {
  return categoryRepository.getByName(name);
};

export const getAllCategories = async (): Promise<Category[]> => {
  return categoryRepository.getAll();
};

export const updateCategory = async (
  id: string,
  categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Category | null> => {
  return categoryRepository.update(id, { ...categoryData, });
};

export const deleteCategory = async (id: string): Promise<void> => {
  return categoryRepository.delete(id);
};