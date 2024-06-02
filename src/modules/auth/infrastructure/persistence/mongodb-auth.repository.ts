import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RepositoryOptionsParams } from '@modules/kernel';

import { Auth } from '../../domain/auth';
import { AuthRepository, FindOneAuthParams } from '../../domain/auth.repository';
import { USER_STATUS } from '@config';

@Injectable()
export class MongoDBAuthRepository implements AuthRepository {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>
  ) { }

  async createOne(auth: Auth, options?: RepositoryOptionsParams): Promise<Auth> {
    if (options?.session) {
      const result = await this.authModel.create([auth], { session: options.session });
      return new Auth(result[0]);
    }
    const result = await this.authModel.create(auth);
    return new Auth(result);
  }

  async findOne(params: FindOneAuthParams): Promise<Auth> {
    const query = { $or: [] };
    if (params.email) {
      query.$or.push({ email: params.email })
    }
    if (params.username) {
      query.$or.push({ username: params.username })
    }

    const auth = await this.authModel.findOne(query);
    if (!auth) {
      return null;
    }
    return new Auth(auth);
  }

  async delete(id: string, options?: RepositoryOptionsParams): Promise<void> {
    await this.authModel.updateOne(
      { id },
      { $set: { status: USER_STATUS.DELETED } },
      { session: options.session }
    )
  }
}