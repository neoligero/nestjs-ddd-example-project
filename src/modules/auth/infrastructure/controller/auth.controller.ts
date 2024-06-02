import { Controller, Request, Post, UseGuards, Body, Req } from '@nestjs/common';
import { GetReqUser } from '../../../kernel/domain/decorator/req-user.decorator';
import { LocalAuthGuard } from '../../domain/guard/local-auth.guard';
import { LoginJWTService } from '../../application/login-jwt/login-jwt.service';
import { RegisterService } from '../../application/register/register.service';
import { RegisterDto } from '../../application/register/register.dto';
import { LoginJWTDto } from '../../application/login-jwt/login-jwt.dto';
import { Public } from '../../../kernel/domain/decorator/public.decorator';
import { UnregisterService } from '../../application/unregister/unregister.service';
import { ROUTE } from '../../../../config/constants/route.constants';
import { ReqUser } from '@modules/kernel';
import { LoginJWTResponse } from 'types/login-jwt.type';

@Controller('auth')
export class AuthController {
  constructor(
    private loginJWTService: LoginJWTService,
    private registerService: RegisterService,
    private unregisterService: UnregisterService,
  ) { }

  // Deprecated: Just for academic purposes
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post(ROUTE.POST_LOGIN_LOCAL)
  async loginLocal(@Request() req): Promise<any> {
    return req.user;
  }
  ////////////////////////////////////////

  @Public()
  @Post(ROUTE.POST_LOGIN)
  login(@Body() loginJWTDto: LoginJWTDto): Promise<LoginJWTResponse> {
    return this.loginJWTService.invoke(loginJWTDto);
  }

  @Public()
  @Post(ROUTE.POST_REGISTER)
  register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.registerService.invoke(registerDto);
  }

  @Post(ROUTE.POST_UNREGISTER)
  unregister(@GetReqUser() user: ReqUser): Promise<void> {
    return this.unregisterService.invoke(user);
  }
}