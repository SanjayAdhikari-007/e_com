import { deleteMultipleFilesFromCloudinary, uploadMultipleFilesToCloudinary } from '../config/cloudinary';
import logger from '../config/logger';
import { Product } from '../entities/product';
import MongoProductRepository from '../interface-adapters/repositories/mongo/mongo-product-repository';

const productRepository = new MongoProductRepository();

export const getProductById = async (id: string): Promise<Product | null> => {
  return productRepository.getById(id);
};

export const getAllProducts = async (): Promise<Product[]> => {
  return productRepository.getAll();
};


export const createProduct = async (
  productData: Omit<Product, 'id' | 'createdAt' | 'images'>,
  files?: Express.Multer.File[]
): Promise<Product> => {
  try{
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      // Use a consistent folder in Cloudinary
      imageUrls = await uploadMultipleFilesToCloudinary(files, 'ecommerce/product_images');
    }
    const productToCreate: Omit<Product, 'id' | 'createdAt'> = {
      ...productData,
      images: imageUrls,
    };
    return productRepository.create(productToCreate);
  }catch (error: any) {
    logger.error('Product service: Error creating product', { error: error.message, stack: error.stack });
    // Important: If image upload succeeded but DB save failed, you might want to delete the uploaded images.
    // This is a common pattern for transaction management in microservices.
    // For now, re-throw for controller to handle
    throw error;
  }
}


// export const createProduct = async (
//   productData: Omit<Product, 'id' | 'createdAt'>,
//   imagePaths: string[] = []
// ): Promise<Product> => {
//   const productToCreate: Omit<Product, 'id' | 'createdAt'> = {
//     ...productData,
//     images: imagePaths,
//   };
//   return productRepository.create(productToCreate);
// };

export const updateProduct = async (
  id: string,
  productData: Partial<Omit<Product, 'id' | 'createdAt'>>,
  imagePaths: string[] = []
): Promise<Product | null> => {
  const existingProduct = await productRepository.getById(id);
  if (!existingProduct) {
    return null;
  }

  const productToUpdate: Partial<Omit<Product, 'id' | 'createdAt'>> = {
    ...productData,
    images: imagePaths.length > 0 ? imagePaths : existingProduct.images, // Add new images, or keep existing if none uploaded// Update variants if provided
  };

  return productRepository.update(id, productToUpdate);
};
// export const updateProduct = async (
//   id: string,
//   productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
// ): Promise<Product | null> => {
//   //  Add business logic for updating
//   return productRepository.update(id, productData);
// };

export const deleteProduct = async (id: string): Promise<void> => {

  try {
    const productToDelete = await productRepository.getById(id);
    if (!productToDelete) {
      logger.warn('Product service: Product not found for deletion', { productId: id });
      return;
    }

    const deletedProduct = await productRepository.delete(id);

    if (productToDelete.images && productToDelete.images.length > 0) {
      await deleteMultipleFilesFromCloudinary(productToDelete.images);
      logger.info('Product service: Deleted associated images', { productId: id, imageCount: productToDelete.images.length });
    }
    logger.info('Product service: Product deleted', { productId: id, });
    return deletedProduct;
  } catch (error: any) {
    logger.error('Product service: Error deleting product', { error: error.message, stack: error.stack, id });
    throw error;
  }
};

// export const deleteProduct = async (id: string): Promise<void> => {
//   //  Add business logic for deleting
//   return productRepository.delete(id);
// };

export const findProductsByCategory = async (categoryId: string): Promise<Product[]> => {
    return productRepository.findByCategory(categoryId);
};

export const findFeatured = async (): Promise<Product[]> => {
    return productRepository.findFeatured();
};

export const findPopular = async (): Promise<Product[]> => {
    return productRepository.findPopular();
};

export const getSingleProductPerCategory = async (): Promise<Product[]> => {
  try {
    const products = await productRepository.findSingleProductPerCategory();
    logger.info('Service: Retrieved single product per category', { count: products.length });
    return products;
  } catch (error: any) {
    logger.error('Service: Error retrieving single product per category:', { error: error.message, stack: error.stack });
    throw error;
  }
};

export const findTwoProductsPerCategory = async (): Promise<Product[]> => {
  try {
    const products = await productRepository.findTwoProductsPerCategory();
    logger.info('Service: Retrieved two products per category', { count: products.length });
    return products;
  } catch (error: any) {
    logger.error('Service: Error retrieving two products per category:', { error: error.message, stack: error.stack });
    throw error;
  }
};



export const findProductsByCategoryName = async (categoryName: string): Promise<Product[]> => {
    return productRepository.findByCategoryName(categoryName);
};