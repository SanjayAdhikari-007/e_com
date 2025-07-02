// src/interface-adapters/repositories/mongo/mongo-user-repository.ts
import { UserRepository } from '../user-repository';
import { User } from '../../../entities/user';
import UserModel, { UserDocument } from '../../../models/user.model';

class UserRepositoryImpl implements UserRepository {
  async getById(id: string): Promise<User | null> {
    const userDocument = await UserModel.findById(id);
    if (!userDocument) {
      return null;
    }
    return this.mapToUserEntity(userDocument);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({ email : email });

    if (!userDocument) {
      return null;
    }
    return this.mapToUserEntity(userDocument);
  }

  async findByEmailRaw(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'password'>, hashedPassword: string): Promise<User> {
    const newUserDocument = await UserModel.create({ ...userData, password: hashedPassword });
    return this.mapToUserEntity(newUserDocument);
  }

  private mapToUserEntity(userDocument: UserDocument): User {
    return {
      id: userDocument.id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      password: userDocument.password,
      createdAt: userDocument.createdAt,
    };
  }
}

export default UserRepositoryImpl;