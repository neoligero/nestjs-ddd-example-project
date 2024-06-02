import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

import { MongoDBUserRepository } from '../../infrastructure/persistence/mongodb-user.repository';
import { MongoDBUserRepositoryMock } from '../../domain/user-repository.mock';
import { UserRepository } from '../../domain/user.repository';
import { DeleteUserService } from './delete-user.service';

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot()
      ],
      providers: [
        DeleteUserService,
        {
          provide: MongoDBUserRepository,
          useClass: MongoDBUserRepositoryMock
        }
      ],
    }).compile();

    service = module.get<DeleteUserService>(DeleteUserService);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
  });

});
