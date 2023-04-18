import * as Joi from 'joi';
import { CONFIG_DB_SCHEMA } from '../config.module';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

function expectValidate(schemaOps: Joi.Schema, value: any) {
  return expect(schemaOps.validate(value, { abortEarly: false }).error.message);
}
describe('Schema unit test', () => {
  describe('DB SCHEMA', () => {
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });

    describe('DB CONNECTION', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, {}).toContain('is required');
      });
      test('invalid cases - when values is not mysql | sqlite', () => {
        expectValidate(schema, { DB_CONNECTION: 'fake' }).toContain(
          'must be one of [postgres, sqlite]',
        );
      });

      test('valid cases', () => {
        const arrange = ['postgres', 'sqlite'];

        arrange.forEach((item) => {
          expectValidate(schema, { DB_CONNECTION: item }).not.toContain(
            'DB_CONNECTION',
          );
        });
      });
    });

    describe('DATABASE URL', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, {}).toContain('is required');

        expectValidate(schema, {
          DATABASE_URL: 1,
        }).toContain('"DATABASE_URL" must be a string');
      });

      test('valid cases', () => {
        const arrange = ['some value'];

        arrange.forEach((item) => {
          expectValidate(schema, {
            DATABASE_URL: item,
          }).not.toContain('DATABASE_URL');
        });
      });
    });
  });
});

describe('config module unit test', () => {
  it('should throw an error when env vars are invalid', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, '.env.fake'),
          }),
        ],
      });
      fail('ConfigModule should throw an error when env vars are invalid');
    } catch (e) {}
  });

  it('should be valid', () => {
    const module = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    });

    expect(module).toBeDefined();
  });
});
