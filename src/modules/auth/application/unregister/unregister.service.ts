import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DeleteUserService } from '@modules/user';

import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';
import { ReqUser } from '@modules/kernel';

export type UnregisterServiceParams = ReqUser;

@Injectable()
export class UnregisterService {
  constructor(
    private authRepository: MongoDBAuthRepository,
    private deleteUserService: DeleteUserService,
    @InjectConnection() private connection: Connection
  ) { }

  async invoke(params: UnregisterServiceParams): Promise<void> {
    const auth = await this.authRepository.findOne({ email: params.email });
    if (auth.toPrimitives().email !== params.email) {
      throw new UnauthorizedException();
    }

    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      // Logically delete auth
      await this.authRepository.delete(params.id, { session: session });

      // Logically delete user
      await this.deleteUserService.invoke(params.id, { session: session });
    });
    await session.endSession();
  }
}