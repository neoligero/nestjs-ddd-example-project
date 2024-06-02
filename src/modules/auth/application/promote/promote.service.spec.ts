// Global imports
import { Test, TestingModule } from '@nestjs/testing';

// Module imports
import { CreateUserService } from '@modules/user';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConnectionMock } from '@modules/kernel/domain/mock/connection.mock';

// Domain imports
import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';
import { MongoDBAuthRepositoryMock } from '../../domain/auth-repository.mock';
import { PromoteService } from './promote.service';

describe('PromoteService', () => {
  let promoteService: PromoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PromoteService,
        {
          provide: MongoDBAuthRepository,
          useClass: MongoDBAuthRepositoryMock
        },
        {
          provide: CreateUserService,
          useValue: {
            invoke: jest.fn()
          }
        },
        {
          provide: getConnectionToken(),
          useClass: ConnectionMock
        }
      ],
    }).compile();

    promoteService = module.get<PromoteService>(PromoteService);
  });

  it('should be defined', () => {
    expect(promoteService).toBeDefined();
  });

});
