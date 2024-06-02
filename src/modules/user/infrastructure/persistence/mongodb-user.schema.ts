import * as mongoose from 'mongoose';
import { UserPrimitives } from '../../domain/user';
import { USER_STATUS } from '@config';

const USER_TABLENAME = "user"

export const UserSchema = new mongoose.Schema<UserPrimitives>({
  id: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: [
      USER_STATUS.ACTIVE,
      USER_STATUS.INACTIVE,
      USER_STATUS.DELETED
    ]
  },
  description: {
    type: String
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true,
  strictQuery: true
});

export const UserModel = mongoose.model<UserPrimitives>(
  USER_TABLENAME,
  UserSchema
);