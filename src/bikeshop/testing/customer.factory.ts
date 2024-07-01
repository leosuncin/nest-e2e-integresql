import { setSeederFactory } from 'typeorm-extension';

import { Customer } from '~bikeshop/customer.entity';

export const customerFactory = setSeederFactory(Customer, (faker) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return Object.assign<Customer, Partial<Customer>>(new Customer(), {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: faker.phone.number(),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
  });
});
