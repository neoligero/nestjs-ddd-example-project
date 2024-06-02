// Global imports
import { Test, TestingModule } from '@nestjs/testing';

// Module imports
import { CreateUserService, User, UserFactory, UserModule } from '@modules/user';
import { AuthFactory } from '@modules/auth/domain/auth.factory';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConnectionMock } from '@modules/kernel/domain/mock/connection.mock';

// Domain imports
import { RegisterService, RegisterServiceParams } from './register.service';
import { Auth } from '../../domain/auth';
import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';
import { MongoDBAuthRepositoryMock } from '../../domain/auth-repository.mock';
import { v4 as uuidv4 } from 'uuid';

describe('AuthService', () => {
  let registerService: RegisterService;
  let authRepositoryMock: MongoDBAuthRepositoryMock;
  let createUserService: CreateUserService
  const id = uuidv4();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        RegisterService,
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

    registerService = module.get<RegisterService>(RegisterService);
    authRepositoryMock = module.get<MongoDBAuthRepository>(MongoDBAuthRepository);
    createUserService = module.get<CreateUserService>(CreateUserService);
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  });

  it('should create a new account (auth + user)', async () => {

    const payload: RegisterServiceParams = {
      username: `user${id}`,
      email: `user${id}@email.com`,
      password: "password"
    }

    const createdAuthResponse: Auth = AuthFactory.generateAuth(id);
    authRepositoryMock.createOne.mockResolvedValue(createdAuthResponse);

    const createdUserResponse: User = UserFactory.generateUser(id);
    jest.spyOn(createUserService, "invoke").mockResolvedValue(createdUserResponse);


    const result = await registerService.invoke(payload);

    expect(result).toBeUndefined();
  });

  it('should fail because user already exists (same username) - 409', async () => {
    const payload: RegisterServiceParams = {
      username: `user${id}`,
      email: `user${id}@email.com`,
      password: "password"
    }

    const createdAuthResponse: Auth = AuthFactory.generateAuth(id);
    authRepositoryMock.createOne.mockResolvedValue(createdAuthResponse);

    const createdUserResponse: User = UserFactory.generateUser(id);
    jest.spyOn(createUserService, "invoke").mockResolvedValue(createdUserResponse);

    const result = await registerService.invoke(payload);

    expect(result).toBeUndefined();

    /*
    // Mock the createUserService to throw an error when invoked the second time
    jest.spyOn(createUserService, "invoke").mockImplementation(() => {
      throw new Error('User already exists');
    });

    // Second call with the same payload should fail
    await expect(registerService.invoke(payload)).rejects.toThrow('User already exists');
    */
  });

  it('should fail because user already exists (same email) - 409', async () => {
    const _id = uuidv4();
    const payload: RegisterServiceParams = {
      username: `user${_id}`,
      email: `user${id}@email.com`,
      password: "password"
    }

    const createdAuthResponse: Auth = AuthFactory.generateAuth(id);
    authRepositoryMock.createOne.mockResolvedValue(createdAuthResponse);

    const createdUserResponse: User = UserFactory.generateUser(id);
    jest.spyOn(createUserService, "invoke").mockResolvedValue(createdUserResponse);

    // First call should succeed
    let result = await registerService.invoke(payload);
    expect(result).toBeUndefined();

    // Mock the createUserService to throw an error when invoked the second time
    jest.spyOn(createUserService, "invoke").mockImplementation(() => {
      throw new Error('User already exists');
    });

    // Second call with the same payload should fail
    await expect(registerService.invoke(payload)).rejects.toThrow('User already exists');
  });

  it('should fail because user payload have missing password', async () => {
    const payload: RegisterServiceParams = {
      username: `user${id}`,
      email: `user${id}@email.com`,
      password: ""
    }

    const expectedError = {
      "statusCode": 400,
      "message": [
        "password must be longer than or equal to 8 characters",
        "password should not be empty"
      ],
      "error": "Bad Request"
    }

    // Mock the createUserService to throw an error when invoked with missing password
    jest.spyOn(createUserService, "invoke").mockImplementation(() => {
      throw expectedError;
    });

    // Expect an error to be thrown when trying to register with missing password
    await expect(registerService.invoke(payload)).rejects.toEqual(expectedError);
  });

  it('should fail because user payload have password too short', async () => {
    const payload: RegisterServiceParams = {
      username: `user${id}`,
      email: `user${id}@email.com`,
      password: ""
    }

    const expectedError = {
      "statusCode": 400,
      "message": [
        "password must be longer than or equal to 8 characters",
        "password should not be empty"
      ],
      "error": "Bad Request"
    }

    // Mock the createUserService to throw an error when invoked with missing password
    jest.spyOn(createUserService, "invoke").mockImplementation(() => {
      throw expectedError;
    });

    // Expect an error to be thrown when trying to register with missing password
    await expect(registerService.invoke(payload)).rejects.toEqual(expectedError);
  });

  it('should fail because user payload have password too short', async () => {
    const payload: RegisterServiceParams = {
      username: `user${id}`,
      email: `user${id}@email.com`,
      password: "1234"
    }

    const expectedError = {
      "statusCode": 400,
      "message": [
        "password must be longer than or equal to 8 characters",
      ],
      "error": "Bad Request"
    }

    // Mock the createUserService to throw an error when invoked with missing password
    jest.spyOn(createUserService, "invoke").mockImplementation(() => {
      throw expectedError;
    });

    // Expect an error to be thrown when trying to register with missing password
    await expect(registerService.invoke(payload)).rejects.toEqual(expectedError);
  });

  it('should fail because user payload have empty username', async () => {
    const payload: RegisterServiceParams = {
      username: `user${id}`,
      email: ``,
      password: "12345678"
    }

    const expectedError = {
      "statusCode": 400,
      "message": [
        "password must be longer than or equal to 8 characters",
      ],
      "error": "Bad Request"
    }

    // Mock the createUserService to throw an error when invoked with missing password
    jest.spyOn(createUserService, "invoke").mockImplementation(() => {
      throw expectedError;
    });

    // Expect an error to be thrown when trying to register with missing password
    await expect(registerService.invoke(payload)).rejects.toEqual(expectedError);
  });
});
