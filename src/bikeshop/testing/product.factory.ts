import { setSeederFactory } from 'typeorm-extension';

import { brands } from '~bikeshop/brands.fixtures';
import { categories } from '~bikeshop/categories.fixtures';
import { Product } from '~bikeshop/product.entity';

export const productFactory = setSeederFactory(Product, (faker) => {
  const brand = faker.helpers.arrayElement(brands);
  const category = faker.helpers.arrayElement(categories);

  return Object.assign<Product, Partial<Product>>(new Product(), {
    name: faker.company.name(),
    modelYear: faker.date.past().getFullYear(),
    listPrice: Number.parseFloat(faker.finance.amount({ min: 9, max: 1_000 })),
    brand,
    category,
  });
});
