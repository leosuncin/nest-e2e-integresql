import { faker } from '@faker-js/faker';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';

import { stores } from '~bikeshop/stores.fixtures';
import { bootstrapApp, initializeIntegreSQL } from './tests-hooks';

describe('StoreController (e2e)', () => {
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

  it('create a new store', async () => {
    const data = {
      name: faker.company.name(),
      email: faker.internet.email({ provider: 'bike.shop' }).toLowerCase(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode().substring(0, 5),
    };

    await request(app.getHttpServer())
      .post('/stores')
      .send(data)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name', data.name);
        expect(body).toHaveProperty('email', data.email);
        expect(body).toHaveProperty('street', data.street);
        expect(body).toHaveProperty('city', data.city);
        expect(body).toHaveProperty('state', data.state);
        expect(body).toHaveProperty('zipCode', data.zipCode);
      });
  });

  it('list all the stores', async () => {
    await request(app.getHttpServer())
      .get('/stores')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(stores.length);
      });
  });

  it('get a store by id', async () => {
    const store = faker.helpers.arrayElement(stores);

    await request(app.getHttpServer())
      .get(`/stores/${store.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: store.id.toString(),
          name: store.name,
          email: store.email || null,
          phone: store.phone || null,
          street: store.street,
          city: store.city,
          state: store.state,
          zipCode: store.zipCode,
        });
      });
  });

  it('fail to get when the store is not found', async () => {
    await request(app.getHttpServer())
      .get(`/stores/${stores.length + 1}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          error: 'Not Found',
          message: `Store with id ${stores.length + 1} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
  });

  it('update a store', async () => {
    const store = faker.helpers.arrayElement(stores);
    const data = {
      name: faker.company.name(),
      email: faker.internet.email({ provider: 'bike.shop' }).toLowerCase(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode().substring(0, 5),
    };

    await request(app.getHttpServer())
      .patch(`/stores/${store.id}`)
      .send(data)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: store.id.toString(),
          name: data.name,
          email: data.email || null,
          phone: store.phone || null,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        });
      });
  });

  it('fail to update when the store is not found', async () => {
    await request(app.getHttpServer())
      .patch(`/stores/${stores.length + 1}`)
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      })
      .expect(HttpStatus.NOT_FOUND)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          error: 'Not Found',
          message: `Store with id ${stores.length + 1} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
  });

  it('delete a store', async () => {
    const store = faker.helpers.arrayElement(stores);

    await request(app.getHttpServer())
      .delete(`/stores/${store.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          name: store.name,
          email: store.email || null,
          phone: store.phone || null,
          street: store.street,
          city: store.city,
          state: store.state,
          zipCode: store.zipCode,
        });
      });
  });

  it('fail to delete when the store is not found', async () => {
    await request(app.getHttpServer())
      .delete(`/stores/${stores.length + 1}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          error: 'Not Found',
          message: `Store with id ${stores.length + 1} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
  });
});
