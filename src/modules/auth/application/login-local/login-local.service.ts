import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';

export interface LoginLocalServiceParams {
  email: string;
  password: string;
}

@Injectable()
export class LoginLocalService {
  constructor(
    private authRepository: MongoDBAuthRepository
  ) { }

  async invoke(params: LoginLocalServiceParams): Promise<any> {
    const auth = await this.authRepository.findOne({ email: params.email });
    if (!auth || !await bcrypt.compare(params.password, auth.toPrimitives().password)) {
      return null;
    }
    const { password, ...result } = auth.toPrimitives();
    return result;
  }
}
