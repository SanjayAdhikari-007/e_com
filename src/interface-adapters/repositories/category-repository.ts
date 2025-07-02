// src/interface-adapters/repositories/category-repository.ts
import { Category } from '../../entities/category';

export interface CategoryRepository {
  getById(id: string): Promise<Category | null>;
  getByName(name: string): Promise<Category | null>;
  getAll(): Promise<Category[]>;
  create(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
  update(id: string, category: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category | null>;
  delete(id: string): Promise<void>;
}