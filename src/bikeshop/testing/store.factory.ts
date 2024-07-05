import { setSeederFactory } from 'typeorm-extension';

import { Store } from '~bikeshop/store.entity';

export const storeFactory = setSeederFactory(Store, (faker) =>
  Object.assign<Store, Partial<Store>>(new Store(), {
    name: faker.company.name(),
    email: faker.internet.email({ provider: 'bike.shop' }).toLowerCase(),
    phone: faker.helpers.fromRegExp(/\+\d{3} \d{4}-\d{4}/),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode().substring(0, 5),
  }),
);
