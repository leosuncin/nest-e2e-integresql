import { IntegreSQLClient } from '@devoxa/integresql-client';
import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import { AppModule } from '~/app.module';
import { brands } from '~bikeshop/brands.fixtures';
import { options as defaultDataSourceOptions } from '../data-source';

const client = new IntegreSQLClient({
  url: process.env.INTEGRESQL_URL ?? 'http://localhost:5000',
});

describe('BrandController (e2e)', () => {
  let app: INestApplication;
  let hash: string;

  beforeAll(async () => {
    hash = await client.hashFiles([
      'src/bikeshop/migrations/*.ts',
      'src/bikeshop/testing/*.ts',
    ]);

    await client.initializeTemplate(hash, async (config) => {
      const dataSource = new DataSource({
        ...defaultDataSourceOptions,
        username: config.username,
        password: config.password,
        database: config.database,
      });

      await dataSource.initialize();
      await dataSource.runMigrations();
      await runSeeders(dataSource);
      await dataSource.destroy();
    });
  });

  beforeEach(async () => {
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
            database,
            password,
            port,
            username,
          };
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('create a new brand', async () => {
    await request(app.getHttpServer())
      .post('/brands')
      .send({
        name: faker.company.name(),
      })
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');
      });
  });

  it('list all the brands', async () => {
    await request(app.getHttpServer())
      .get('/brands')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(brands.length);
      });
  });

  it('get a brand by id', async () => {
    const brand = faker.helpers.arrayElement(brands);

    await request(app.getHttpServer())
      .get(`/brands/${brand.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: brand.id.toString(),
          name: brand.name,
        });
      });
  });

  it('update a brand', async () => {
    const brand = faker.helpers.arrayElement(brands);
    const data = {
      name: faker.company.name(),
    };

    await request(app.getHttpServer())
      .patch(`/brands/${brand.id}`)
      .send(data)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: brand.id.toString(),
          name: data.name,
        });
      });
  });

  it('delete a brand', async () => {
    const brand = faker.helpers.arrayElement(brands);

    await request(app.getHttpServer())
      .delete(`/brands/${brand.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          name: brand.name,
        });
      });
  });
});
