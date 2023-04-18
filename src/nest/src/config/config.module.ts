import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';

export type DB_SCHEMA_TYPE = {
  DB_CONNECTION: 'postgres' | 'sqlite';
  DATABASE_URL: string;
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_CONNECTION: Joi.string().required().valid('postgres', 'sqlite'),
  DATABASE_URL: Joi.string().required(),
};

export type CONFIG_DB_SCHEMA = DB_SCHEMA_TYPE;

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const { envFilePath, ...rest } = options;
    return super.forRoot({
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
        join(__dirname, `../envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, '../envs/.env'),
      ],
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
      }),
      ...rest,
    });
  }
}
