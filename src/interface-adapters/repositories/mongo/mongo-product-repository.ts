import { ProductRepository } from '../product-repository';
import { Product } from '../../../entities/product';
import ProductModel, { ProductDocument } from '../../../models/product.model';
import dotenv from 'dotenv';
import CategoryModel from '../../../models/category.model';
import logger from '../../../config/logger';

dotenv.config();

class ProductRepositoryImpl implements ProductRepository {
  async getById(id: string): Promise<Product | null> {
    try {
      const productDocument = await ProductModel.findById(id).populate('category'); // Populate the category field
      if (!productDocument) {
        return null;
      }
      return this.mapToProductEntity(productDocument);
    } catch (error) {
      logger.error('Error getting product by ID:', error);
      throw error; // Re-throw the error to be handled by the service layer
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      const productDocuments = await ProductModel.find().populate('category'); // Populate the category
      return productDocuments.map(this.mapToProductEntity);
    } catch (error) {
      logger.error('Error getting all products:', error);
      throw error;
    }
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const newProductDocument = await ProductModel.create(product);
      return this.mapToProductEntity(newProductDocument);
    } catch (error) {
      logger.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> {
    try {
      const updatedProductDocument = await ProductModel.findByIdAndUpdate(id, product, { new: true, runValidators: true }).populate('category');
      if (!updatedProductDocument) {
        return null;
      }
      return this.mapToProductEntity(updatedProductDocument);
    } catch (error) {
      logger.error('Error updating product:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await ProductModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting product:', error);
      throw error; // Re-throw to be handled by service
    }
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    try {
      const productDocuments = await ProductModel.find({ category: categoryId }).populate('category');
      return productDocuments.map(this.mapToProductEntity);
    } catch (error) {
      logger.error('Error finding products by category:', error);
      throw error;
    }
  }

  async findFeatured(): Promise<Product[]> {
    try {
      const productDocuments = await ProductModel.find({ isFeatured: true }).populate('category');
      return productDocuments.map(this.mapToProductEntity);
    } catch (error) {
      logger.error('Error Finding Featured products :', error);
      throw error;
    }
  }

  async findTwoProductsPerCategory(): Promise<Product[]> { // Renamed method for clarity
    try {
      const result = await ProductModel.aggregate([
        // Stage 1: Sort products within each category consistently.
        // Sorting by category first, then by _id ensures we get a consistent "first two" products.
        {
          $sort: { category: 1, _id: 1 }
        },
        // Stage 2: Group products by category and collect all products into an array.
        {
          $group: {
            _id: "$category", // Group by the category ID
            // Push the entire product document into an array for each group
            productsInGroup: { $push: "$$ROOT" }
          }
        },
        // Stage 3: Project to get only the first two products from the array.
        {
          $project: {
            _id: 0, // Exclude the group _id (category ID) for now
            // Use $slice to get the first 2 elements from the 'productsInGroup' array
            // [array, startIndex, count]
            firstTwoProducts: { $slice: ["$productsInGroup", 2] }
          }
        },
        // Stage 4: Deconstruct the 'firstTwoProducts' array into separate documents.
        // This will create a new document for each of the two products.
        {
          $unwind: "$firstTwoProducts"
        },
        // Stage 5: Replace the root document with the unwound product document.
        // This promotes the individual product document to the top level.
        {
          $replaceRoot: { newRoot: "$firstTwoProducts" }
        },
        // Stage 6: Final projection to reshape the output documents.
        // Rename _id to id and select specific fields.
        {
          $project: {
            id: "$_id", // Create 'id' field from '_id'
            _id: 0,      // Exclude the original '_id' field
            name: "$name", // Assuming 'name' is the field for product title
            description: "$description", // Assuming 'detail' is 'description'
            price: 1,
            category: 1,
            imageUrls: "$imageUrls", // Assuming 'images' is 'imageUrls'
            createdAt: 1,
            updatedAt: 1,
            // Assuming these fields exist in your Product model
            isInStock: 1,
            brandName: 1,
            discountRate: 1,
            priceAfterDiscount: 1,
            rating: 1,
            color: 1,
          }
        }
      ]);

      logger.info('Repo: Fetched two products per category', { count: result.length });
      // The result of aggregation will match IProduct structure due to $replaceRoot and $project.
      return result as Product[];
    } catch (error: any) {
      logger.error('Repo: Error fetching two products per category:', { error: error.message, stack: error.stack });
      throw new Error('Failed to fetch two products per category from database.');
    }
  }

  async findSingleProductPerCategory(): Promise<Product[]> {
    try {
      const result = await ProductModel.aggregate([
        {
          $sort: { category: 1, _id: 1 }
        },
        {
          $group: {
            _id: "$category", // Group by the category ID
            singleProduct: { $first: "$$ROOT" } // Take the entire first product document found for this category
          }
        },
        {
          $replaceRoot: { newRoot: "$singleProduct" }
        },
        {
          $project: {
            id: "$_id",
            title: 1,         
            detail: 1,  
            price: 1,       
            category: 1,     
            images: 1,    
            createdAt: 1,    
            isInStock: 1,    
            brandName: 1,
            discountRate: 1,
            priceAfterDiscount: 1,
            rating: 1,
            color:1,
            _id: 0,          
          }
        }
      ]);

      logger.info('Repo: Fetched single product per category', { count: result.length });
      // The result of aggregation will match IProduct structure due to $replaceRoot and $lookup.
      return result as Product[];
    } catch (error: any) {
      logger.error('Repo: Error fetching single product per category:', { error: error.message, stack: error.stack });
      throw new Error('Failed to fetch single product per category from database.');
    }
  }

  async findByCategoryName(categoryName: string): Promise<Product[]> {
    try {
      const categoryDoc = await CategoryModel.findOne({ name: categoryName });
      const productDocuments = await ProductModel.find({ category: categoryDoc?.id }).populate('category');
      return productDocuments.map(this.mapToProductEntity);
    } catch (error) {
      logger.error('Error finding products by category:', error);
      throw error;
    }
  }

  private mapToProductEntity(productDocument: ProductDocument): Product {
    return {
      id: productDocument.id.toString(), // Convert Mongoose _id to string
      title: productDocument.title,
      detail: productDocument.detail,
      price: productDocument.price,
      category: (productDocument.category as any)._id.toString(), // Access _id of populated Category
      brandName: productDocument.brandName,
      isInStock: productDocument.isInStock,
      isFeatured: productDocument.isFeatured,
      images: productDocument.images,
      createdAt: productDocument.createdAt,
      color: productDocument.color,
      pattern: productDocument.pattern,
      discountRate: productDocument.discountRate,
      priceAfterDiscount: productDocument.priceAfterDiscount,
      rating: productDocument.rating
    };
  }
}

export default ProductRepositoryImpl;