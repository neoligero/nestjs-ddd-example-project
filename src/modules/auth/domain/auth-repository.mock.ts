import { AuthRepository } from "./auth.repository";


export class MongoDBAuthRepositoryMock implements AuthRepository {
  createOne: jest.MockedFunction<any>;
  findOne: jest.MockedFunction<any>;
  delete: jest.MockedFunction<any>;

  constructor() {
    this.createOne = jest.fn();
    this.findOne = jest.fn();
    this.delete = jest.fn();
  }
}