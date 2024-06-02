import { ROLE, USER_STATUS } from '@config';
import { AuthPrimitives } from '../../domain/auth';
import mongoose from 'mongoose';

const USER_TABLENAME = "auth"

export const AuthSchema = new mongoose.Schema<AuthPrimitives>({
  id: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: [
      USER_STATUS.ACTIVE,
      USER_STATUS.INACTIVE,
      USER_STATUS.DELETED
    ]
  },
  roles: {
    type: [String],
    enum: [
      ROLE.USER,
      ROLE.ADMIN
    ]
  }
}, {
  timestamps: true,
  strictQuery: true
});

export const UserModel = mongoose.model<AuthPrimitives>(
  USER_TABLENAME,
  AuthSchema
);