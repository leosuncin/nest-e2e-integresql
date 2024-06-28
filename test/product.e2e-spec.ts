import { IntegreSQLClient } from '@devoxa/integresql-client';
import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import { AppModule } from '~/app.module';
import { products } from '~bikeshop/products.fixtures';
import { options as defaultDataSourceOptions } from '../data-source';

const client = new IntegreSQLClient({
  url: process.env.INTEGRESQL_URL ?? 'http://localhost:5000',
});

describe('ProductController (e2e)', () => {
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
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('create a new product', async () => {
    const data = {
      name: faker.company.name(),
      modelYear: faker.number.int({ min: 1970, max: new Date().getFullYear() }),
      listPrice: Number.parseFloat(faker.finance.amount({ min: 0.01 })),
      brand: faker.number.bigInt({ min: 1, max: 9 }).toString(),
      category: faker.number.bigInt({ min: 1, max: 7 }).toString(),
    };
    await request(app.getHttpServer())
      .post('/products')
      .send(data)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name', data.name);
        expect(body).toHaveProperty('modelYear', data.modelYear);
        expect(body).toHaveProperty('listPrice', data.listPrice);
        expect(body).toHaveProperty('brand', data.brand);
        expect(body).toHaveProperty('category', data.category);
      });
  });

  it('list all the products', async () => {
    await request(app.getHttpServer())
      .get('/products')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(products.length);
      });
  });

  it('get a product by id', async () => {
    const product = faker.helpers.arrayElement(products);

    await request(app.getHttpServer())
      .get(`/products/${product.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: product.id.toString(),
          name: product.name,
          modelYear: product.modelYear,
          listPrice: product.listPrice,
          brandId: product.brandId.toString(),
          categoryId: product.categoryId.toString(),
        });
      });
  });

  it('update a product', async () => {
    const product = faker.helpers.arrayElement(products);
    const data = {
      name: faker.company.name(),
      modelYear: faker.date.past().getFullYear(),
      listPrice: Number.parseFloat(
        faker.finance.amount({ min: 9, max: 1_000 }),
      ),
    };

    await request(app.getHttpServer())
      .patch(`/products/${product.id}`)
      .send(data)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: product.id.toString(),
          name: data.name,
          modelYear: data.modelYear,
          listPrice: data.listPrice,
          brandId: product.brandId.toString(),
          categoryId: product.categoryId.toString(),
        });
      });
  });

  it('delete a product', async () => {
    const product = faker.helpers.arrayElement(products);

    await request(app.getHttpServer())
      .delete(`/products/${product.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          name: product.name,
          modelYear: product.modelYear,
          listPrice: product.listPrice,
          brandId: product.brandId.toString(),
          categoryId: product.categoryId.toString(),
        });
      });
  });
});
