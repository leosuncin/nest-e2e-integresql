import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Product } from '~bikeshop/product.entity';
import { products } from '~bikeshop/products.fixtures';

export class ProductSeeder implements Seeder {
  track = false;

  async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.upsert(Product, products, {
      conflictPaths: ['id'],
      upsertType: 'on-conflict-do-update',
      skipUpdateIfNoValuesChanged: true,
    });
    await dataSource.query(
      /* sql */ `SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products))`,
    );
  }
}
