import { ConflictException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';
import { Auth } from '../../domain/auth';
import { CreateUserService, CreateUserServiceParams } from '@modules/user/application/create-user/create-user.service';
import { ROLE } from '@config';

export interface RegisterServiceParams {
  username: string;
  email: string;
  password: string;
  roles?: ROLE[];
}

@Injectable()
export class RegisterService {
  constructor(
    private authRepository: MongoDBAuthRepository,
    private createUserService: CreateUserService,
    @InjectConnection() private connection: Connection
  ) { }

  async invoke(params: RegisterServiceParams): Promise<void> {
    const auth = await this.authRepository.findOne(params);
    if (auth) {
      throw new ConflictException();
    }
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      // Create auth
      const newAuth: Auth = await Auth.build(params);
      const savedAuth = await this.authRepository.createOne(newAuth, { session: session });

      const createUserParams: CreateUserServiceParams = {
        id: newAuth.toPrimitives().id,
        ...params
      }
      // Create user
      const savedUser = await this.createUserService.invoke(createUserParams, { session: session });

      if (savedAuth.toPrimitives().id !== savedUser.toPrimitives().id) {
        throw new InternalServerErrorException();
      }
    });
    await session.endSession();
  }
}