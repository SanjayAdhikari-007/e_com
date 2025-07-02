import express, { Request, RequestHandler, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/mongo';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import authRoutes from './routes/auth.routes';
import logger from './config/logger';
import { authenticateToken } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT as string;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('E Commerce API');
});

// Product routes
app.use('/api/products', authenticateToken as RequestHandler ,productRoutes);

// Category routes
app.use('/api/categories', authenticateToken as RequestHandler, categoryRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info(`Server is running on port: ${port}`);
    });
  } catch (error) { 
    logger.error(error);
  }
};

start();

export default app;