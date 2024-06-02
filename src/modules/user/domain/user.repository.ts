import { Injectable } from "@nestjs/common";
import { User } from "./user";
import { SearchUserServiceParams } from "../application/search-user/search-user.service";

@Injectable()
export abstract class UserRepository {
  abstract createOne(user: User): Promise<User>;
  abstract findOne(id: string): Promise<User>;
  abstract search(params: SearchUserServiceParams): Promise<User[]>;
  abstract delete(id: string): Promise<void>;
}
