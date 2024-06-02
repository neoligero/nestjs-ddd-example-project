import { Injectable } from "@nestjs/common";
import { User } from "./user";
import { v4 as uuidv4 } from 'uuid';
import { USER_STATUS } from "@config";

@Injectable()
export class UserFactory {
  constructor() { }

  static generateUser(id?: string): User {
    id = id || uuidv4();
    return new User({
      id: id,
      username: `user${id.split('-')[0]}`,
      email: `user${id.split('-')[0]}@email.com`,
      status: USER_STATUS.ACTIVE,
      description: "",
      avatar: "",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}