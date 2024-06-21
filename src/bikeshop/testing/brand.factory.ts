import { setSeederFactory } from 'typeorm-extension';

import { Brand } from '~bikeshop/brand.entity';

export const brandFactory = setSeederFactory(Brand, (faker) =>
  Object.assign(new Brand(), {
    name: faker.company.name(),
  }),
);
