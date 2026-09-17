import { Injectable, Logger } from '@nestjs/common';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

/**
 * Reads secrets from AWS Secrets Manager.
 *
 * In development, point AWS_ENDPOINT_URL at a local Floci instance
 * (https://floci.io) instead of real AWS — see docker-compose.yml.
 * In production, unset AWS_ENDPOINT_URL and provide real IAM credentials
 * (or rely on the environment's default credential chain) to hit AWS itself.
 */
@Injectable()
export class SecretsService {
  private readonly logger = new Logger(SecretsService.name);
  private readonly client: SecretsManagerClient;
  private readonly cache = new Map<string, Record<string, string>>();

  constructor() {
    this.client = new SecretsManagerClient({
      endpoint: process.env.AWS_ENDPOINT_URL || undefined,
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: process.env.AWS_ENDPOINT_URL
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'test',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'test',
          }
        : undefined,
    });
  }

  /**
   * Fetches and parses a JSON secret by id, caching it for the process lifetime.
   */
  async getSecret(secretId: string): Promise<Record<string, string>> {
    const cached = this.cache.get(secretId);
    if (cached) {
      return cached;
    }

    const { SecretString } = await this.client.send(
      new GetSecretValueCommand({ SecretId: secretId }),
    );

    if (!SecretString) {
      throw new Error(`Secret "${secretId}" has no string value`);
    }

    const parsed = JSON.parse(SecretString) as Record<string, string>;
    this.cache.set(secretId, parsed);
    this.logger.log(`Loaded secret "${secretId}" from Secrets Manager`);
    return parsed;
  }
}
