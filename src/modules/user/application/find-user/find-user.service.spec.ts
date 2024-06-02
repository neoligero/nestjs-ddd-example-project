import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

import { FindUserService } from './find-user.service';
import { MongoDBUserRepository } from '../../infrastructure/persistence/mongodb-user.repository';
import { MongoDBUserRepositoryMock } from '../../domain/user-repository.mock';
import { UserRepository } from '../../domain/user.repository';

describe('UsersService', () => {
  let service: FindUserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot()
      ],
      providers: [
        FindUserService,
        {
          provide: MongoDBUserRepository,
          useClass: MongoDBUserRepositoryMock
        }
      ],
    }).compile();

    service = module.get<FindUserService>(FindUserService);
    userRepository = module.get<MongoDBUserRepository>(MongoDBUserRepository);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a NotFoundError', async () => {
    jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

    try {
      await service.invoke(uuidv4())
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
    }
  });

});
