import { ROLE, USER_STATUS } from "@config";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';

export interface AuthParams {
  id: string;
  email: string;
  password: string;
  username: string;
  status: USER_STATUS;
  roles: ROLE[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildAuthParams {
  id?: string;
  email: string;
  password: string;
  username: string;
  status?: USER_STATUS;
  roles?: ROLE[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Auth {
  private id: string;
  private email: string;
  private password: string;
  private username: string;
  private status: USER_STATUS;
  private roles: ROLE[];
  private createdAt: Date;
  private updatedAt: Date;

  constructor(params: AuthParams) {
    this.id = params.id;
    this.email = params.email;
    this.password = params.password;
    this.username = params.username;
    this.status = params.status;
    this.roles = params.roles;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  toPrimitives() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      username: this.username,
      status: this.status,
      roles: this.roles,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static async build(params: BuildAuthParams) {
    const hashedPassword = await bcrypt.hashSync(params.password, 10);

    return new Auth({
      id: params.id ? params.id : uuidv4(),
      email: params.email,
      password: hashedPassword,
      username: params.username,
      status: params.status || USER_STATUS.ACTIVE,
      roles: params.roles || [ROLE.USER],
      createdAt: params.createdAt || new Date(),
      updatedAt: params.updatedAt || new Date()
    });
  }
}

export type AuthPrimitives = ReturnType<Auth["toPrimitives"]>;