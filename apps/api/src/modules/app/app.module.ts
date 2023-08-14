import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@cowchain/database';
import { RedisModule } from '@cowchain/redis';

import { ApplicationSeedModule } from '../application-seed/application-seed.module';
import {
  RedisConnection,
  DatabaseConnection,
  appConfig,
  databaseConfig,
  redisConfig,
} from 'src/configs';
import { LoggerMiddleware } from 'src/infrastructure/logger';
import { ExampleModule } from '../example/example.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, appConfig, redisConfig],
      isGlobal: true,
    }),
    DbModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConnection,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConnection,
    }),
    ApplicationSeedModule,
    ExampleModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
