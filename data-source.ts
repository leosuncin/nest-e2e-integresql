import 'dotenv/config';
import 'tsconfig-paths/register';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { CreateBrandsTable } from '~bikeshop/1718954984063-create-brands-table';
import { CreateCategoriesTable } from '~bikeshop/1719002522747-create-categories-table';
import { CreateProductsTable } from '~bikeshop/1719220180803-create-products-table';
import { Brand } from '~bikeshop/brand.entity';
import { brandFactory } from '~bikeshop/brand.factory';
import { BrandSeeder } from '~bikeshop/brand.seeder';
import { Category } from '~bikeshop/category.entity';
import { categoryFactory } from '~bikeshop/category.factory';
import { CategorySeeder } from '~bikeshop/category.seeder';
import { Product } from '~bikeshop/product.entity';
import { productFactory } from '~bikeshop/product.factory';
import { ProductSeeder } from '~bikeshop/product.seeder';

export const options = {
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  entities: [Brand, Category, Product],
  migrations: [CreateBrandsTable, CreateCategoriesTable, CreateProductsTable],
  factories: [brandFactory, categoryFactory, productFactory],
  seeds: [BrandSeeder, CategorySeeder, ProductSeeder],
} satisfies DataSourceOptions & SeederOptions;

export default new DataSource(options);
