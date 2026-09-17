import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { ObserveModule } from './observe/observe.js';
import { SecretsModule } from './secrets/secrets.module.js';

@Module({
  imports: [
    // No OBSERVE_APP_KEY/OBSERVE_APP_SECRET configured (e.g. local dev without
    // an observe.nestjs.com account): the collector answers 401 and telemetry
    // is dropped — the app itself still runs normally either way.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? '',
      appSecret: process.env.OBSERVE_APP_SECRET ?? '',
      serviceId: process.env.OBSERVE_SERVICE_ID ?? 'nestjs-app',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    SecretsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
