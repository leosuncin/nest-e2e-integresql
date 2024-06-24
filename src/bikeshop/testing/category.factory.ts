import { setSeederFactory } from 'typeorm-extension';

import { Category } from '~bikeshop/category.entity';

export const categoryFactory = setSeederFactory(Category, (faker) =>
  Object.assign(new Category(), {
    name: faker.company.name(),
  }),
);
