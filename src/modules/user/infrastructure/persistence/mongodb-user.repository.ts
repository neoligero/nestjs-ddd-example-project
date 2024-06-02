import { ClientSession, Model } from 'mongoose';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/user';
import { SearchUserServiceParams } from '../../application/search-user/search-user.service';
import { UserRepository } from '../../domain/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { RepositoryOptionsParams } from '@modules/kernel';
import { USER_STATUS } from '@config';

@Injectable()
export class MongoDBUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) { }

  async createOne(user: User, options?: RepositoryOptionsParams): Promise<User> {
    if (options?.session) {
      const savedUser = await this.userModel.create([user], { session: options.session });
      return new User(savedUser[0]);
    }
    const savedUser = await this.userModel.create(user);
    return new User(savedUser);
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userModel.findOne({ id });
    if (!user) {
      return null;
    }
    return new User(user);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return null;
    }
    return new User(user);
  }

  async search(params: SearchUserServiceParams): Promise<User[]> {
    const query = {};
    if (params.username) {
      query['username'] = params.username;
    }
    if (params.email) {
      query['email'] = params.email;
    }
    const users = await this.userModel.find(query);
    return users.map((item) => new User(item))
  }

  async delete(id: string, options?: RepositoryOptionsParams): Promise<void> {
    await this.userModel.updateOne(
      { id },
      { $set: { status: USER_STATUS.DELETED } },
      { session: options.session }
    )
  }
}
