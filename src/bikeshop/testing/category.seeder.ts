import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { categories } from '~bikeshop/categories.fixtures';
import { Category } from '~bikeshop/category.entity';

export class CategorySeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.upsert(Category, categories, {
      conflictPaths: ['id'],
      upsertType: 'on-conflict-do-update',
      skipUpdateIfNoValuesChanged: true,
    });
    await dataSource.query(
      /* sql */ `SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories))`,
    );
  }
}
