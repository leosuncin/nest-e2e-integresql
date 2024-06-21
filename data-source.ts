import 'dotenv/config';
import 'tsconfig-paths/register';
import { DataSource, DataSourceOptions } from 'typeorm';

import { CreateBrandsTable } from '~bikeshop/1718954984063-create-brands-table';
import { Brand } from '~bikeshop/brand.entity';
import { Category } from '~bikeshop/category.entity';

const options = {
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  entities: [Brand, Category],
  migrations: [CreateBrandsTable],
} satisfies DataSourceOptions;

export default new DataSource(options);
