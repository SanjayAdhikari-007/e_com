// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { registerUser, loginUser} from '../services/auth.service';
import { User as UserEntity } from '../entities/user';
import { validationResult } from 'express-validator';


export const registerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const {name, email, password } = req.body;
    const userData: Omit<UserEntity, 'id' | 'createdAt' | 'password'> = { name ,email };
    const newUser = await registerUser(userData, password);
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error: any) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const {email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Incorrect password') {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: 'Login failed', error: error.message });
    }
  }
};