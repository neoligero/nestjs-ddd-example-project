import { INestApplication, ValidationPipe } from "@nestjs/common";
import { MongoDBMemoryDatabase } from "./infrastructure/persistence/mongodb-in-memory.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";
import { AuthModule, JwtAuthGuard, RolesGuard } from "@modules/auth";
import { UserModule } from "@modules/user";
import { APP_GUARD } from "@nestjs/core";
import { SeederService, TEST_ADMIN_USER_1, TEST_USER_1 } from "./domain/seeder";
import { AuthController } from "@modules/auth/infrastructure/controller/auth.controller";

export class TestApp {
  module: TestingModule
  app: INestApplication;
  memoryDatabase: MongoDBMemoryDatabase;
  server: any;
  testUserToken: string;
  testAdminUserToken: string;

  constructor() { }

  async create(): Promise<void> {
    this.memoryDatabase = new MongoDBMemoryDatabase();
    this.module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRootAsync(this.memoryDatabase.getConnection()),
        AuthModule,
        UserModule
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
        SeederService
      ]
    }).compile();

    this.app = this.module.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe());
    await this.app.init();
    this.server = this.app.getHttpServer();

    const authController = this.module.get<AuthController>(AuthController);
    // User login
    this.testUserToken = (await authController.login({
      email: TEST_USER_1.email,
      password: TEST_USER_1.password
    })
    ).auth_token;
    // Admin user login
    this.testAdminUserToken = (await authController.login({
      email: TEST_ADMIN_USER_1.email,
      password: TEST_ADMIN_USER_1.password
    })
    ).auth_token;
  }

  getServer(): any {
    return this.server;
  }

  getTestUserToken(): string {
    return this.testUserToken;
  }

  getTestAdminUserToken(): string {
    return this.testAdminUserToken;
  }

  async close(): Promise<void> {
    const connection = this.app.get(getConnectionToken());
    await connection.dropDatabase();
    await this.memoryDatabase.closeConnection();
    await this.app.close();
  }
}