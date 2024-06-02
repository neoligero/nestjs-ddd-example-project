import { Injectable } from "@nestjs/common";
import { Auth } from "./auth";

export interface FindOneAuthParams {
  email?: string;
  username?: string;
}

@Injectable()
export abstract class AuthRepository {
  abstract createOne(auth: Auth): Promise<Auth>;
  abstract findOne(params: FindOneAuthParams): Promise<Auth>;
  abstract delete(email: string): Promise<void>;
}
