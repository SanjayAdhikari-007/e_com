import multer from 'multer';
import { Request } from 'express';
import logger from '../config/logger';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); 
  } else {
    logger.warn(`Upload Middleware: Rejected file type for ${file.originalname}: ${file.mimetype}. Only images allowed.`);
    cb(null, false);
  }
};


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export default upload;



// // src/middleware/upload.middleware.ts
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/products/'); // Where uploaded images will be stored
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, uniqueSuffix + fileExtension); // Unique filename
//   },
// });

// const fileFilter = (req: any, file: any, cb: any) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true); // Accept images
//   } else {
//     cb(new Error('Only image files are allowed!'), false); // Reject non-images
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// export default upload;