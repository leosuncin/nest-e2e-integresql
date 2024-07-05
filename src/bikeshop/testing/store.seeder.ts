import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Store } from '~bikeshop/store.entity';
import { stores } from '~bikeshop/stores.fixtures';

export class StoreSeeder implements Seeder {
  track = false;

  async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.upsert(Store, stores, {
      conflictPaths: ['id'],
      upsertType: 'on-conflict-do-update',
    });
    await dataSource.query(
      /* sql */ `SELECT setval(pg_get_serial_sequence('stores', 'id'), (SELECT MAX(id) FROM stores))`,
    );
  }
}
