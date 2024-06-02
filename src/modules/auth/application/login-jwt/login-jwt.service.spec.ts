import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { LoginJWTService } from './login-jwt.service';
import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';
import { MongoDBAuthRepositoryMock } from '../../domain/auth-repository.mock';

describe('AuthService', () => {
  let service: LoginJWTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot()
      ],
      providers: [
        LoginJWTService,
        JwtService,
        {
          provide: MongoDBAuthRepository,
          useClass: MongoDBAuthRepositoryMock
        }
      ],
    }).compile();

    service = module.get<LoginJWTService>(LoginJWTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
