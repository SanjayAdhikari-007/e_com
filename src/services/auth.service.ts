import { User } from '../entities/user';
import MongoUserRepository from '../interface-adapters/repositories/mongo/mongo-user-repository';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const userRepository = new MongoUserRepository();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (userData: Omit<User, 'id' | 'createdAt' | 'password'>, password: string): Promise<User> => {
  const existingUserByEmail = await userRepository.findByEmail(userData.email);
  if (existingUserByEmail) {
    throw new Error('Email already exists');
  }

  return userRepository.create(userData, password);
};


export const loginUser = async (email: string, password: string ): Promise<{ user:User; token: String }> => {
    let userDocument: UserDocument | null = null;
    userDocument = await userRepository.findByEmailRaw(email);
    
  
    if (!userDocument) {
      throw new Error('User not found');
    }
  
    if (userDocument.password && !(await userDocument.comparePassword(password))) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign({ userId: userDocument.id.toString() }, JWT_SECRET, { expiresIn: '150d' });

    const userEntity = {
      id: userDocument.id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      createdAt: userDocument.createdAt,
    };
  
    return {  user:userEntity, token };
  };
