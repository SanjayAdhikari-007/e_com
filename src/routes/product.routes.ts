// src/routes/product.routes.ts
import { Router, Request, Response, NextFunction } from 'express';

import {
  createProductHandler,
  getProductByIdHandler,
  getAllProductsHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductsByCategoryHandler,
  createProductWithImagesHandler, // New create with images
  updateProductWithImagesHandler,
  getProductsByCategoryAndColorHandler,
  getProductsByCategoryNameAndColorHandler,
  getSingleProductPerCategoryHandler,
  getProductsByCategoryNamePatternAndColorHandler,
  getProductsByCategoryName,
  getProductsByCategoryNameAndPatternHandler,
  getProductsFeatured,
  getTwoProductsPerCategoryHandler,
  getProductsPopular
} from '../controllers/product.controller';// Make sure this is imported
import upload from '../middleware/upload.middleware'; // Make sure your upload middleware is imported here
import logger from '../config/logger';
import multer from 'multer';

const MAX_IMAGES_PER_PRODUCT = 10; // Adjust as needed

// This middleware wraps Multer to handle its errors and check its output
const handleMulterError = (req: Request, res: Response, next: NextFunction) => {
  // 'productImages' MUST EXACTLY MATCH the 'name' attribute of your file input in the frontend HTML.
  upload.array('images', MAX_IMAGES_PER_PRODUCT)(req, res, (err: any) => {
    // --- CRITICAL DEBUG LOGS HERE ---
    console.log('\n--- Multer Processing Debug ---');
    console.log('1. Multer error (if any):', err);
    console.log('2. req.body after Multer (text fields):', req.body);
    console.log('3. req.files after Multer (file data):', req.files);

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file: Express.Multer.File, index: number) => {
        console.log(`   File ${index}: originalname='${file.originalname}', mimetype='${file.mimetype}', size=${file.size} bytes`);
        console.log(`   Buffer status for File ${index}: ${file.buffer ? 'BUFFER EXISTS (OK)' : 'BUFFER MISSING (PROBLEM)'}`);
      });
    } else if (req.files === undefined) {
      console.log('   req.files is UNDEFINED. Multer did not process files or field name mismatch.');
    } else if (Array.isArray(req.files) && req.files.length === 0) {
      console.log('   req.files is an EMPTY ARRAY. No files selected or all rejected by filter/limits.');
    }
    console.log('--- End Multer Processing Debug ---\n');
    // --- END CRITICAL DEBUG LOGS ---

    // Check for specific Multer errors (e.g., file size, unexpected field)
    if (err instanceof multer.MulterError) {
      logger.error('Route: Multer Error during file upload:', { code: err.code, message: err.message, field: err.field });
      return res.status(400).json({ message: `File upload error: ${err.message}`, code: err.code });
    } else if (err) {
      // Catch errors from fileFilter (e.g., "Only image files are allowed!")
      logger.error('Route: Generic error during file upload:', { message: err.message, stack: err.stack });
      return res.status(400).json({ message: err.message });
    }
    // If no errors, proceed to the next middleware/controller
    next();
  });
};


const router = Router();

router.get('/popular', getProductsPopular);
router.get('/percategory', getTwoProductsPerCategoryHandler);
router.get('/twopercategory', getTwoProductsPerCategoryHandler);
router.get('/featured', getProductsFeatured);
router.post('/', createProductHandler);
router.get('/:id', getProductByIdHandler);
router.get('/', getAllProductsHandler);
router.put('/:id', updateProductHandler);
router.delete('/:id', deleteProductHandler);
router.get('/category/:categoryId', getProductsByCategoryHandler);
router.get('/vs/:categoryId', getProductsByCategoryAndColorHandler);
router.get('/vsc/:categoryName', getProductsByCategoryName);
router.get('/vscc/:categoryName', getProductsByCategoryNameAndColorHandler);
router.get('/vscp/:categoryName', getProductsByCategoryNameAndPatternHandler);
router.get('/visual_search/:categoryName', getProductsByCategoryNamePatternAndColorHandler);

// Routes for creating and updating products with image uploads
router.post('/with-images', handleMulterError ,createProductWithImagesHandler);
router.put('/with-images/:id', updateProductWithImagesHandler);

export default router;