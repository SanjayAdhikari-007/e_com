// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  findProductsByCategory,
  findProductsByCategoryName,
  getSingleProductPerCategory,
  findFeatured,
  findTwoProductsPerCategory
} from '../services/product.service';
import { Product } from '../entities/product';
import upload from '../middleware/upload.middleware';
import logger from '../config/logger';

export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData: Omit<Product, 'id' | 'createdAt'> = req.body;
    const newProduct = await createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
};


export const createProductWithImagesHandler = [
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      console.log(req.files);
      console.log("Files " + files);

      const productData: Omit<Product, 'id' | 'createdAt' | 'images'> = {
        title: req.body.title,
        detail: req.body.detail,
        price: Number(req.body.price),
        category: req.body.category,
        brandName: req.body.brandName,
        isInStock: req.body.isInStock,
        isFeatured: req.body.isFeatured,
        color: req.body.color,
        pattern: req.body.pattern,
        discountRate: req.body.discountRate,
        priceAfterDiscount: req.body.priceAfterDiscount,
        rating: req.body.rating
      };

      console.log(productData);

      const newProduct = await createProduct(productData, files);
      res.status(201).json(newProduct);
    } catch (error) {
      logger.error('Error creating product with images:', error);
      res.status(500).json({ message: 'Failed to create product with images', error });
    }
  },
];
// export const createProductWithImagesHandler = [
//   upload.array('images', 10), // 'images' is the field name for the files, max 10
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const imagePaths = (req.files as Express.Multer.File[] || []).map((file) => file.path.replace(/\\/g, '/'));
//       const productData: Omit<Product, 'id' | 'createdAt'> = {
//         title: req.body.title,
//         detail: req.body.detail,
//         price: Number(req.body.price),
//         category: req.body.category,
//         brandName: req.body.brandName,
//         images: imagePaths, // Extra
//         isInStock: req.body.isInStock,
//         color: req.body.color,
//         discountRate: req.body.discountRate,
//         priceAfterDiscount: req.body.priceAfterDiscount,
//         rating: req.body.rating
//       };

//       const newProduct = await createProduct(productData, imagePaths);
//       res.status(201).json(newProduct);
//     } catch (error) {
//       console.error('Error creating product with images:', error);
//       res.status(500).json({ message: 'Failed to create product with images', error });
//     }
//   },
// ];



export const updateProductWithImagesHandler = [
  upload.array('images', 10),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const imagePaths = (req.files as Express.Multer.File[] || []).map((file) => file.path.replace(/\\/g, '/'));
      const productData: Partial<Omit<Product, 'id' | 'createdAt'>> = {
        title: req.body.title,
        detail: req.body.detail,
        price: Number(req.body.price),
        category: req.body.category,
        brandName: req.body.brandName,
        images: imagePaths, // Extra
        isInStock: req.body.isInStock,
        color: req.body.color,
        pattern: req.body.pattern,
        discountRate: req.body.discountRate,
        priceAfterDiscount: req.body.priceAfterDiscount,
        rating: req.body.rating
      };

      const updatedProduct = await updateProduct(id, productData, imagePaths);
      if (!updatedProduct) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product with images:', error);
      res.status(500).json({ message: 'Failed to update product with images', error });
    }
  },
];

export const getProductByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve product', error });
  }
};

export const getAllProductsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products', error });
  }
};

export const updateProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productData: Partial<Omit<Product, 'id' | 'createdAt'>> = req.body;
    const updatedProduct = await updateProduct(id, productData);
    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

export const deleteProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};

export const getProductsByCategoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const products = await findProductsByCategory(categoryId);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve products', error });
    }
};

export const getProductsFeatured = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await findFeatured();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve featured products', error });
    }
};

export const getProductsByCategoryAndColorHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const { color } = req.query;
        var products = await findProductsByCategory(categoryId);
        
        if (color) {
          products = products.filter(product => product.color.toLowerCase() === (color as string).toLowerCase());
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve products with given description', error });
    }
};

export const getProductsByCategoryNameAndColorHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryName } = req.params;
        const { color } = req.query;
        var products = await findProductsByCategoryName(categoryName);
        
        if (color) {
          products = products.filter(product => product.color.toLowerCase() === (color as string).toLowerCase());
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve products with given description', error });
    }
};

export const getProductsByCategoryNameAndPatternHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryName } = req.params;
        const { pattern } = req.query;
        var products = await findProductsByCategoryName(categoryName);
        
        if (pattern) {
          products = products.filter(product => product.pattern.toLowerCase() === (pattern as string).toLowerCase());
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve products with given description', error });
    }
};

export const getProductsByCategoryName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryName } = req.params;
        var products = await findProductsByCategoryName(categoryName);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve products with given description', error });
    }
};

export const getProductsByCategoryNamePatternAndColorHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryName } = req.params;
        const { color, pattern } = req.query;
        var products = await findProductsByCategoryName(categoryName);
        
        if (color) {
          products = products.filter(product => product.color.toLowerCase() === (color as string).toLowerCase());
        }
        if (pattern) {
          products = products.filter(product => product.pattern.toLowerCase() === (pattern as string).toLowerCase());
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve products with given description', error });
    }
};

export const getSingleProductPerCategoryHandler = async (req: Request, res: Response) => {
  try {
    logger.info('Controller: Incoming request to get single product per category');
    const products = await getSingleProductPerCategory();
    res.status(200).json(products);
    logger.info('Controller: Sent single product per category', { count: products.length });
  } catch (error: any) {
    logger.error('Controller: Error getting single product per category:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Failed to retrieve single product per category.', error: error.message });
  }
};

export const getTwoProductsPerCategoryHandler = async (req: Request, res: Response) => {
  try {
    logger.info('Controller: Incoming request to get single product per category');
    const products = await findTwoProductsPerCategory();
    res.status(200).json(products);
    logger.info('Controller: Sent single product per category', { count: products.length });
  } catch (error: any) {
    logger.error('Controller: Error getting single product per category:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Failed to retrieve single product per category.', error: error.message });
  }
};
