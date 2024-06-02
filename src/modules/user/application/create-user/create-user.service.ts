import { Injectable } from '@nestjs/common';
import { ServiceOptionsParams } from '@modules/kernel';

import { BuildUserParams, User } from '../../domain/user';
import { MongoDBUserRepository } from '../../infrastructure/persistence/mongodb-user.repository';

export type CreateUserServiceParams = BuildUserParams;

@Injectable()
export class CreateUserService {
  constructor(
    private userRepository: MongoDBUserRepository
  ) { }

  async invoke(params: CreateUserServiceParams, options?: ServiceOptionsParams): Promise<User> {
    const user = await User.build(params);
    return await this.userRepository.createOne(user, options);
  }

}
