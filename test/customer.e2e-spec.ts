import { faker } from '@faker-js/faker';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';

import { customers } from '~bikeshop/customers.fixtures';
import { bootstrapApp, initializeIntegreSQL } from './tests-hooks';

describe('CustomerController (e2e)', () => {
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

  it('create a new customer', async () => {
    const data = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode().substring(0, 5),
    };

    await request(app.getHttpServer())
      .post('/customers')
      .send(data)
      //.expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('firstName', data.firstName);
        expect(body).toHaveProperty('lastName', data.lastName);
        expect(body).toHaveProperty('email', data.email);
        expect(body).toHaveProperty('street', data.street);
        expect(body).toHaveProperty('city', data.city);
        expect(body).toHaveProperty('state', data.state);
        expect(body).toHaveProperty('zipCode', data.zipCode);
      });
  });

  it('avoid to create a duplicate customer', async () => {
    const customer = faker.helpers.arrayElement(customers);

    await request(app.getHttpServer())
      .post('/customers')
      .send({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        street: customer.street,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
      })
      .expect(HttpStatus.CONFLICT)
      .expect(({ body }) => {
        expect(body).toHaveProperty('error', 'Conflict');
        expect(body).toHaveProperty(
          'message',
          `The email ${customer.email} already exists`,
        );
        expect(body).toHaveProperty('statusCode', HttpStatus.CONFLICT);
      });
  });

  it('list all the customers', async () => {
    await request(app.getHttpServer())
      .get('/customers')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(customers.length);
      });
  });

  it('get a customer by id', async () => {
    const customer = faker.helpers.arrayElement(customers);

    await request(app.getHttpServer())
      .get(`/customers/${customer.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: customer.id.toString(),
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone || null,
          street: customer.street,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
        });
      });
  });

  it('fail to get when the customer is not found', async () => {
    await request(app.getHttpServer())
      .get(`/customers/${customers.length + 1}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          error: 'Not Found',
          message: `Customer with id ${customers.length + 1} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
  });

  it('update a customer', async () => {
    const customer = faker.helpers.arrayElement(customers);
    const data = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode().substring(0, 5),
    };

    await request(app.getHttpServer())
      .patch(`/customers/${customer.id}`)
      .send(data)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: customer.id.toString(),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: customer.phone || null,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        });
      });
  });

  it('fail to update when the customer is not found', async () => {
    await request(app.getHttpServer())
      .patch(`/customers/${customers.length + 1}`)
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      })
      .expect(HttpStatus.NOT_FOUND)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          error: 'Not Found',
          message: `Customer with id ${customers.length + 1} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
  });

  it('delete a customer', async () => {
    const customer = faker.helpers.arrayElement(customers);

    await request(app.getHttpServer())
      .delete(`/customers/${customer.id}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone || null,
          street: customer.street,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
        });
      });
  });

  it('fail to delete when the customer is not found', async () => {
    await request(app.getHttpServer())
      .delete(`/customers/${customers.length + 1}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          error: 'Not Found',
          message: `Customer with id ${customers.length + 1} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
  });
});
