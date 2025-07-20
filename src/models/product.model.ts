// src/models/product.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../entities/product';

// Define the Mongoose Document interface for Product
export interface ProductDocument extends Omit<Product, 'id'>, Document {}

// Define the Mongoose schema for Product
const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    detail: { type: String },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to the Category model
    brandName: { type: String },
    isInStock: { type: Boolean, required: true, default: true },
    isFeatured: { type: Boolean, required: true, default: false },
    images: [{ type: String }], // Array of image URLs/paths
    color: {type: String},
    pattern: {type: String},
    discountRate: {type: Number, min:0, max:100},
    priceAfterDiscount: {type: Number},
    rating: {type: Number, min:0, max:5 },
  },
  { timestamps: true } // Adds createdAt fields automatically
);

// Create the Mongoose model for Product
const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);

export default ProductModel;