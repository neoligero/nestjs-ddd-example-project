import { ROLE } from "@config";
import { RegisterService } from "@modules/auth/application/register/register.service";
import { AuthFactory } from "@modules/auth/domain/auth.factory";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";

export const TEST_USER_1 = {
  id: "example-id-user-1",
  username: "user1",
  email: "user1@email.com",
  password: "password",
  roles: [ROLE.USER]
}

export const TEST_ADMIN_USER_1 = {
  id: "example-id-admin-user-1",
  username: "adminUser1",
  email: "adminUser1@email.com",
  password: "password",
  roles: [ROLE.USER, ROLE.ADMIN]
}

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private registerService: RegisterService
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    const auth = AuthFactory.generateAuth();
    await this.registerService.invoke(TEST_USER_1);
    await this.registerService.invoke(TEST_ADMIN_USER_1);
  }
}