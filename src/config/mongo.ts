import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info('Database Connection Successfull.');
  } catch (error) {
    logger.error('Could not connect to Database', error);
    process.exit(1); // Exit process on database connection failure
  }
};

export default connectDB;