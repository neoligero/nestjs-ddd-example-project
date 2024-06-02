import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/user';
import { MongoDBUserRepository } from '../../infrastructure/persistence/mongodb-user.repository';

@Injectable()
export class FindUserService {
  constructor(
    private userRepository: MongoDBUserRepository
  ) { }

  async invoke(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

}