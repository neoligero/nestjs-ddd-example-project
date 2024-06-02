import { Injectable } from "@nestjs/common";
import { Auth } from "./auth";
import { ROLE, USER_STATUS } from "@config";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthFactory {
  constructor() { }

  static generateAuth(id?: string): Auth {
    id = id || uuidv4();
    return new Auth({
      id: id,
      email: `user${id}@email.com`,
      password: `password`,
      username: `user${id}`,
      status: USER_STATUS.ACTIVE,
      roles: [ROLE.USER],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

}