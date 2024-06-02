import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { UserFactory } from '../../domain/user.factory';
import { SearchUserService } from './search-user.service';
import { MongoDBUserRepository } from '../../infrastructure/persistence/mongodb-user.repository';
import { MongoDBUserRepositoryMock } from '../../domain/user-repository.mock';

describe('UsersService', () => {
  let service: SearchUserService;
  let userRepository: MongoDBUserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot()
      ],
      providers: [
        SearchUserService,
        UserFactory,
        {
          provide: MongoDBUserRepository,
          useClass: MongoDBUserRepositoryMock
        }
      ],
    }).compile();

    service = module.get<SearchUserService>(SearchUserService);
    userRepository = module.get<MongoDBUserRepository>(MongoDBUserRepository);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array looking by username', async () => {
    jest.spyOn(userRepository, 'search').mockResolvedValue([]);

    const result = await service.invoke({ username: 'nobody' });
    expect(result).toHaveLength(0);
  })

  it('should return an empty array looking by email', async () => {
    jest.spyOn(userRepository, 'search').mockResolvedValue([]);

    const result = await service.invoke({ email: 'nobody@email.com' });
    expect(result).toHaveLength(0);
  })
});
