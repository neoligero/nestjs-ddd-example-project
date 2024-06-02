// Global imports
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

// Module imports
import { KernelService, ReqUser } from '@modules/kernel';
import { DeleteUserService } from '@modules/user';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConnectionMock } from '@modules/kernel/domain/mock/connection.mock';

// Domain imports
import { UnregisterService } from './unregister.service';
import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';
import { MongoDBAuthRepositoryMock } from '../../domain/auth-repository.mock';
import { AuthFactory } from '@modules/auth/domain/auth.factory';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let unregisterService: UnregisterService;
  let authRepositoryMock: MongoDBAuthRepositoryMock;
  let deleteUserService: DeleteUserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UnregisterService,
        {
          provide: MongoDBAuthRepository,
          useClass: MongoDBAuthRepositoryMock
        },
        {
          provide: DeleteUserService,
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

    unregisterService = module.get<UnregisterService>(UnregisterService);
    authRepositoryMock = module.get<MongoDBAuthRepository>(MongoDBAuthRepository);
    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
  });

  it('should be defined', () => {
    expect(unregisterService).toBeDefined();
  });

  it('should delete an account (auth + user)', async () => {
    const id = uuidv4();
    const auth = AuthFactory.generateAuth(id);

    const reqUser: ReqUser = {
      id: auth.toPrimitives().id,
      email: auth.toPrimitives().email,
      username: auth.toPrimitives().username,
      roles: auth.toPrimitives().roles
    }

    authRepositoryMock.findOne.mockResolvedValue(auth);
    authRepositoryMock.delete.mockResolvedValue();
    jest.spyOn(deleteUserService, "invoke").mockResolvedValue();

    await unregisterService.invoke(reqUser);
  });


  it('should return Unauthorized Exception if the user does not belongs to the token owner', async () => {
    const id1 = uuidv4();
    const id2 = uuidv4();
    const auth1 = AuthFactory.generateAuth(id1);
    const auth2 = AuthFactory.generateAuth(id2);

    const reqUser: ReqUser = {
      id: auth1.toPrimitives().id,
      email: auth1.toPrimitives().email,
      username: auth1.toPrimitives().username,
      roles: auth1.toPrimitives().roles
    }

    authRepositoryMock.findOne.mockResolvedValue(auth2);
    authRepositoryMock.delete.mockResolvedValue();
    jest.spyOn(deleteUserService, "invoke").mockResolvedValue();

    try {
      await unregisterService.invoke(reqUser);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }
  });

});
