import { UserRepository } from "./user.repository";


export class MongoDBUserRepositoryMock implements UserRepository {
  createOne: jest.MockedFunction<any>;
  findOne: jest.MockedFunction<any>;
  search: jest.MockedFunction<any>;
  delete: jest.MockedFunction<any>;

  constructor() {
    this.createOne = jest.fn();
    this.findOne = jest.fn();
    this.search = jest.fn();
    this.delete = jest.fn();
  }
}