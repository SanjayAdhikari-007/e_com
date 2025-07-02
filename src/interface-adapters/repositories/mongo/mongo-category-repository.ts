// src/interface-adapters/repositories/mongo/mongo-category-repository.ts
import { CategoryRepository } from '../category-repository';
import { Category } from '../../../entities/category';
import CategoryModel, { CategoryDocument } from '../../../models/category.model';

class CategoryRepositoryImpl implements CategoryRepository {
  async getById(id: string): Promise<Category | null> {
    const categoryDocument = await CategoryModel.findById(id);
    if (!categoryDocument) {
      return null;
    }
    return this.mapToCategoryEntity(categoryDocument);
  }

  async getByName(name: string): Promise<Category | null> {
    const categoryDocument = await CategoryModel.findOne({name: name});
    if (!categoryDocument) {
      return null;
    }
    return this.mapToCategoryEntity(categoryDocument);
  }

  async getAll(): Promise<Category[]> {
    const categoryDocuments = await CategoryModel.find();
    return categoryDocuments.map(this.mapToCategoryEntity);
  }

  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const newCategoryDocument = await CategoryModel.create(category);
    return this.mapToCategoryEntity(newCategoryDocument);
  }

  async update(id: string, category: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | null> {
    const updatedCategoryDocument = await CategoryModel.findByIdAndUpdate(id, category, { new: true, runValidators: true });
    if (!updatedCategoryDocument) {
      return null;
    }
    return this.mapToCategoryEntity(updatedCategoryDocument);
  }

  async delete(id: string): Promise<void> {
    await CategoryModel.findByIdAndDelete(id);
  }

  private mapToCategoryEntity(categoryDocument: CategoryDocument): Category {
    return {
      id: categoryDocument.id.toString(),
      name: categoryDocument.name,
      description: categoryDocument.description,
      createdAt: categoryDocument.createdAt,
    };
  }
}

export default CategoryRepositoryImpl;