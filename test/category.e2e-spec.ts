import { IntegreSQLClient } from '@devoxa/integresql-client';
import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import { AppModule } from '~/app.module';
import { categories } from '~bikeshop/categories.fixtures';
import { options as defaultDataSourceOptions } from '../data-source';

const client = new IntegreSQLClient({
  url: process.env.INTEGRESQL_URL ?? 'http://localhost:5000',
});

describe('CategoryController (e2e)', () => {
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

  it('create a new category', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: faker.company.name(),
      })
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');
      });
  });

  it('list all the categories', async () => {
    await request(app.getHttpServer())
      .get('/categories')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(categories.length);
      });
  });

  it('get a category by id', async () => {
    const category = faker.helpers.arrayElement(categories);

    await request(app.getHttpServer())
      .get(`/categories/${category.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: category.id.toString(),
          name: category.name,
        });
      });
  });

  it('update a category', async () => {
    const category = faker.helpers.arrayElement(categories);
    const data = {
      name: faker.company.name(),
    };

    await request(app.getHttpServer())
      .patch(`/categories/${category.id}`)
      .send(data)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: category.id.toString(),
          name: data.name,
        });
      });
  });

  it('delete a category', async () => {
    const category = faker.helpers.arrayElement(categories);

    await request(app.getHttpServer())
      .delete(`/categories/${category.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          name: category.name,
        });
      });
  });
});
