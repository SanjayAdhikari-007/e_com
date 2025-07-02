// src/models/category.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '../entities/category';

export interface CategoryDocument extends Omit<Category, 'id'>, Document {}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model<CategoryDocument>('Category', CategorySchema);

export default CategoryModel;