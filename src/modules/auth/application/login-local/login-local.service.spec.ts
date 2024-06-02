import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { LoginLocalService } from './login-local.service';
import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';
import { MongoDBAuthRepositoryMock } from '../../domain/auth-repository.mock';


describe('AuthService', () => {
  let service: LoginLocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot()
      ],
      providers: [
        LoginLocalService,
        JwtService,
        {
          provide: MongoDBAuthRepository,
          useClass: MongoDBAuthRepositoryMock
        }
      ],
    }).compile();

    service = module.get<LoginLocalService>(LoginLocalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
