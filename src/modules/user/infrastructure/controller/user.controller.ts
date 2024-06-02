import { Controller, Body, Get, Param, Post, Delete, Query } from '@nestjs/common';
import { ROLE } from '@config';
import { Roles } from '@modules/kernel';
import {
  CreateUserService,
  FindUserService,
  SearchUserService,
  DeleteUserService,
} from '../../application';
import { CreateUserDto } from '../../application/create-user/create-user.dto';
import { ROUTE } from '../../../../config/constants/route.constants';
import { SearchUserDto } from '../../application/search-user/search-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private findUserService: FindUserService,
    private searchUserService: SearchUserService,
    private deleteUserService: DeleteUserService
  ) { }

  @Roles(ROLE.ADMIN)
  @Post(ROUTE.POST_CREATE_USER)
  createOne(@Body() user: CreateUserDto) {
    return this.createUserService.invoke(user);
  }

  @Get(ROUTE.GET_USER)
  findOne(@Param('id') id: string) {
    return this.findUserService.invoke(id);
  }

  @Get(ROUTE.GET_ALL_USER)
  search(@Query() params: SearchUserDto) {
    return this.searchUserService.invoke(params);
  }

  @Roles(ROLE.ADMIN)
  @Delete(ROUTE.DELETE_USER)
  deleteOne(@Param('id') id: string) {
    return this.deleteUserService.invoke(id);
  }
}
