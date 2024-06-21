import 'dotenv/config';
import 'tsconfig-paths/register';
import { DataSource, DataSourceOptions } from 'typeorm';

import { CreateBrandsTable } from '~bikeshop/1718954984063-create-brands-table';
import { CreateCategoriesTable } from '~bikeshop/1719002522747-create-categories-table';
import { Brand } from '~bikeshop/brand.entity';
import { Category } from '~bikeshop/category.entity';

const options = {
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  entities: [Brand, Category],
  migrations: [CreateBrandsTable, CreateCategoriesTable],
} satisfies DataSourceOptions;

export default new DataSource(options);
