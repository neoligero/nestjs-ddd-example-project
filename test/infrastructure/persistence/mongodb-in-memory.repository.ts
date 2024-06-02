import { MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

/**
 * Fix library issues for memory database
 * wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
 * dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
 * */

export class MongoDBMemoryDatabase {
  private mongodb: MongoMemoryReplSet;

  getConnection(options: MongooseModuleOptions = {}) {
    return {
      useFactory: async () => {
        this.mongodb = await MongoMemoryReplSet.create();
        const mongoUri = this.mongodb.getUri();
        return {
          uri: mongoUri,
          ...options,
        }
      }
    }
  };

  closeConnection = async () => {
    if (this.mongodb) {
      await this.mongodb.stop();
    }
  }
}