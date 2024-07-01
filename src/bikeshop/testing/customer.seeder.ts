import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Customer } from '~bikeshop/customer.entity';
import { customers } from '~bikeshop/customers.fixtures';

export class CustomerSeeder implements Seeder {
  track = false;

  async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.upsert(Customer, customers, {
      conflictPaths: ['id'],
      upsertType: 'on-conflict-do-update',
    });
    await dataSource.query(
      /* sql */ `SELECT setval(pg_get_serial_sequence('customers', 'id'), (SELECT MAX(id) FROM customers))`,
    );
  }
}
