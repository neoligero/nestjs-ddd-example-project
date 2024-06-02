import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './infrastructure/controller/user.controller';
import { MongoDBUserRepository } from './infrastructure/persistence/mongodb-user.repository';
import { UserSchema } from './infrastructure/persistence/mongodb-user.schema';
import { User } from './domain';
import {
  CreateUserService,
  DeleteUserService,
  FindUserService,
  SearchUserService
} from './application';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [
    UserController
  ],
  providers: [
    CreateUserService,
    FindUserService,
    SearchUserService,
    DeleteUserService,
    MongoDBUserRepository
  ],
  exports: [
    CreateUserService,
    FindUserService,
    SearchUserService,
    DeleteUserService
  ],
})

export class UserModule { }