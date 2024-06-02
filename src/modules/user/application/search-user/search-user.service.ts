import { Model } from 'mongoose';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/user';
import { MongoDBUserRepository } from '../../infrastructure/persistence/mongodb-user.repository';

export interface SearchUserServiceParams {
  username?: string;
  email?: string;
}

@Injectable()
export class SearchUserService {
  constructor(
    private userRepository: MongoDBUserRepository
  ) { }

  async invoke(params: SearchUserServiceParams): Promise<User[]> {
    return await this.userRepository.search(params);
  }
}