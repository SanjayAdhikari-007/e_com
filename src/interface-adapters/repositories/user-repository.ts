import { User } from '../../entities/user';
import { UserDocument } from '../../models/user.model';

export interface UserRepository {
  getById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'password'>, hashedPassword: string): Promise<User>;
}