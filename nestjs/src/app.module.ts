import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { SecretsModule } from './secrets/secrets.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SecretsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
