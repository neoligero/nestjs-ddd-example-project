import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';
import { ConfigModule } from '@nestjs/config';

import { UserFactory } from '../../domain/user.factory';
import { User } from '../../domain/user';
import { MongoDBUserRepository } from '../../infrastructure/persistence/mongodb-user.repository';
import { MongoDBUserRepositoryMock } from '../../domain/user-repository.mock';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let user: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
      ],
      providers: [
        CreateUserService,
        UserFactory,
        {
          provide: MongoDBUserRepository,
          useClass: MongoDBUserRepositoryMock
        }
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    user = UserFactory.generateUser();
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
  });

});
