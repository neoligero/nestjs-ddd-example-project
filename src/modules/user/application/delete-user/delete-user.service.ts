import { Injectable } from '@nestjs/common';
import { MongoDBUserRepository } from '../../infrastructure/persistence/mongodb-user.repository';
import { ServiceOptionsParams } from '@modules/kernel';

@Injectable()
export class DeleteUserService {
  constructor(
    private userRepository: MongoDBUserRepository
  ) { }

  async invoke(id: string, options?: ServiceOptionsParams): Promise<void> {
    await this.userRepository.delete(id, options);
  }

}