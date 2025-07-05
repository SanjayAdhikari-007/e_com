// src/interface-adapters/repositories/product-repository.ts
import { Product } from '../../entities/product';

export interface ProductRepository {
  getById(id: string): Promise<Product | null>;
  getAll(): Promise<Product[]>;
  create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  update(id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null>;
  delete(id: string): Promise<void>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findByCategoryName(categoryName: string): Promise<Product[]>;
  findSingleProductPerCategory(): Promise<Product[]>;
}