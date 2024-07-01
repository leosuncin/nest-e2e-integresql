import { faker } from '@faker-js/faker';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';

import { brands } from '~bikeshop/brands.fixtures';
import { bootstrapApp, initializeIntegreSQL } from './tests-hooks';

describe('BrandController (e2e)', () => {
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
