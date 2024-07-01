import { faker } from '@faker-js/faker';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';

import { categories } from '~bikeshop/categories.fixtures';
import { bootstrapApp, initializeIntegreSQL } from './tests-hooks';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let hash: string;

  beforeAll(async () => {
    hash = await initializeIntegreSQL();
  });

  beforeEach(async () => {
    app = await bootstrapApp(hash);
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
