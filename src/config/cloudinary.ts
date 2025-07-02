import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  logger.error('Cloudinary environment variables are not fully defined. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
  process.exit(1);
}

const uploadSingleFileInternal = async (file: Express.Multer.File, folder: string): Promise<string> => {
  try {
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: folder,
      resource_type: 'auto'
    });

    logger.info(`Single file uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error: any) {
    logger.error('Error uploading single file to Cloudinary:', { error: error.message, stack: error.stack, fileName: file.originalname });
    throw new Error(`Failed to upload file ${file.originalname} to cloud storage.`);
  }
};

export const uploadMultipleFilesToCloudinary = async (files: Express.Multer.File[], folder: string = 'uploads'): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map(file => uploadSingleFileInternal(file, folder));

  try {
    const imageUrls = await Promise.all(uploadPromises);
    logger.info(`Successfully uploaded ${imageUrls.length} files to Cloudinary.`);
    return imageUrls;
  } catch (error: any) {
    logger.error('One or more files failed to upload to Cloudinary:', { error: error.message, stack: error.stack });
    throw new Error('Failed to upload one or more images to cloud storage.');
  }
};

export const deleteFileFromCloudinary = async (fileUrl: string): Promise<void> => {
  try {
    const publicIdMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.(?:png|jpg|jpeg|gif|webp|bmp|tiff|svg)$/);
    if (!publicIdMatch || publicIdMatch.length < 2) {
      logger.warn(`Could not extract public ID from Cloudinary URL for deletion: ${fileUrl}`);
      return;
    }
    const publicId = publicIdMatch[1];

    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      logger.info(`File deleted from Cloudinary: ${publicId}`);
    } else {
      logger.warn(`Failed to delete file from Cloudinary: ${publicId}`, { result });
    }
  } catch (error: any) {
    logger.error('Error deleting file from Cloudinary:', { error: error.message, stack: error.stack, fileUrl });
  }
};

export const deleteMultipleFilesFromCloudinary = async (fileUrls: string[]): Promise<void> => {
  if (!fileUrls || fileUrls.length === 0) {
    return;
  }
  const deletePromises = fileUrls.map(url => deleteFileFromCloudinary(url));
  try {
    await Promise.all(deletePromises);
    logger.info(`Successfully initiated deletion of ${fileUrls.length} files from Cloudinary.`);
  } catch (error: any) {
    logger.error('One or more files failed to delete from Cloudinary:', { error: error.message, stack: error.stack });
  }
};