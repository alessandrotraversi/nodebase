import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { ObserveInstrument } from './observe/observe.js';
import { SecretsService } from './secrets/secrets.service.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  // `instrument` must be passed here, not just ObserveModule imported in
  // AppModule — this is the hook that lets the agent wrap providers as
  // Nest constructs them, before any of the app's own code runs.
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // Warm up the secrets cache at boot so a misconfigured/unreachable
  // Secrets Manager (real AWS or the local Floci emulator) surfaces
  // immediately instead of failing on the first request that needs it.
  const secretsService = app.get(SecretsService);
  const secretId = process.env.SECRETS_MANAGER_SECRET_ID ?? 'app/database';
  try {
    await secretsService.getSecret(secretId);
  } catch (error) {
    logger.warn(
      `Could not load secret "${secretId}" from Secrets Manager: ${(error as Error).message}. ` +
        'Continuing without it — set AWS_ENDPOINT_URL to a running Floci instance to enable it locally.',
    );
  }

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
