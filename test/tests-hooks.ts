import { IntegreSQLClient } from '@devoxa/integresql-client';
import type { INestApplication } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import { AppModule } from '~/app.module';
import { options as defaultDataSourceOptions } from '../data-source';

const client = new IntegreSQLClient({
  url: process.env.INTEGRESQL_URL ?? 'http://localhost:5000',
});

export async function initializeIntegreSQL() {
  const hash = await client.hashFiles([
    'src/bikeshop/migrations/*.ts',
    'src/bikeshop/testing/*.ts',
    'data-source.ts',
  ]);

  await client.initializeTemplate(
    hash,
    async ({ database, password, port, username }) => {
      const dataSource = new DataSource({
        ...defaultDataSourceOptions,
        username,
        password,
        database,
        port,
      });

      await dataSource.initialize();
      await dataSource.runMigrations();
      await runSeeders(dataSource);
      await dataSource.destroy();
    },
  );

  return hash;
}

export async function bootstrapApp(hash: string): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(getConfigToken('typeorm'))
    .useFactory({
      async factory() {
        const { database, password, port, username } =
          await client.getTestDatabase(hash);

        return {
          type: 'postgres',
          autoLoadEntities: true,
          username,
          password,
          database,
          port,
        };
      },
    })
    .compile();

  const app = moduleFixture.createNestApplication();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app.init();
}
