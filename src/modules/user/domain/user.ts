import { USER_STATUS } from '@config';
import { v4 as uuidv4 } from 'uuid';

export interface UserParams {
  id: string;
  username: string;
  email: string;
  status: USER_STATUS;
  description: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildUserParams {
  id?: string;
  username: string;
  email: string;
  status?: USER_STATUS;
  description?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private id: string;
  private username: string;
  private email: string;
  private status: USER_STATUS;
  private description: string;
  private avatar: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(params: UserParams) {
    this.id = params.id;
    this.username = params.username;
    this.email = params.email;
    this.status = params.status;
    this.description = params.description;
    this.avatar = params.avatar;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  toPrimitives() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      status: this.status,
      description: this.description,
      avatar: this.avatar,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static build(params: BuildUserParams) {
    return new User({
      id: params.id || uuidv4(),
      username: params.username,
      email: params.email,
      status: params.status || USER_STATUS.ACTIVE,
      description: params.description || "",
      avatar: params.avatar || "",
      createdAt: params.createdAt || new Date(),
      updatedAt: params.updatedAt || new Date()
    });
  }
}

export type UserPrimitives = ReturnType<User["toPrimitives"]>;