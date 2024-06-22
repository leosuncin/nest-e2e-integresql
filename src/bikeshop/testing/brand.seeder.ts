import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Brand } from '~bikeshop/brand.entity';
import { brands } from '~bikeshop/brands.fixtures';

export class BrandSeeder implements Seeder {
  track = false;

  async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.upsert(Brand, brands, {
      conflictPaths: ['id'],
      upsertType: 'on-conflict-do-update',
    });
    await dataSource.query(
      /* sql */ `SELECT setval(pg_get_serial_sequence('brands', 'id'), (SELECT MAX(id) FROM brands))`,
    );
  }
}
