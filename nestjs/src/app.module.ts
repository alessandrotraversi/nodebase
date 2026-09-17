import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { ObserveModule } from './observe/observe.js';
import { SecretsModule } from './secrets/secrets.module.js';

@Module({
  imports: [
    // Must come before ObserveModule.forRoot() below: ConfigModule.forRoot()
    // loads .env into process.env synchronously as part of the call itself,
    // but only for imports array entries evaluated after it runs — Nest
    // doesn't defer these, each is invoked in array order as the array
    // literal is built. Reversed, OBSERVE_APP_KEY/OBSERVE_APP_SECRET would
    // still read as empty and every request gets a silent 401.
    ConfigModule.forRoot({ isGlobal: true }),
    // No OBSERVE_APP_KEY/OBSERVE_APP_SECRET configured (e.g. local dev without
    // an observe.nestjs.com account): the collector answers 401 and telemetry
    // is dropped — the app itself still runs normally either way.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? '',
      appSecret: process.env.OBSERVE_APP_SECRET ?? '',
      serviceId: process.env.OBSERVE_SERVICE_ID ?? 'nestjs-app',
    }),
    SecretsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
