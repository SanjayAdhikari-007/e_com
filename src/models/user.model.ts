// src/models/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';

export interface UserDocument extends Omit<User, 'id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>; // Explicitly declare the instance method
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
  },
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;