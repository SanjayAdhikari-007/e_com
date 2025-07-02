// src/routes/auth.routes.ts
import express from 'express';
import { registerHandler, loginHandler } from '../controllers/auth.controller';
import { body } from 'express-validator';

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Please provide a valid email address.').trim(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.').trim(),
  ],  registerHandler);

router.post('/login', [
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.').trim(),
    body('email').isEmail().withMessage('Please provide a valid email address.').trim(),
], loginHandler);

export default router;