import 'dotenv/config';
import 'tsconfig-paths/register';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { CreateBrandsTable } from '~bikeshop/1718954984063-create-brands-table';
import { CreateCategoriesTable } from '~bikeshop/1719002522747-create-categories-table';
import { CreateProductsTable } from '~bikeshop/1719220180803-create-products-table';
import { CreateCustomersTable } from '~bikeshop/1719509356809-create-customers-table';
import { CreateStoresTable } from '~bikeshop/1720142160331-create-stores-table';
import { CreateStocksTable } from '~bikeshop/1720152106642-create-stocks-table';
import { Brand } from '~bikeshop/brand.entity';
import { brandFactory } from '~bikeshop/brand.factory';
import { BrandSeeder } from '~bikeshop/brand.seeder';
import { Category } from '~bikeshop/category.entity';
import { categoryFactory } from '~bikeshop/category.factory';
import { CategorySeeder } from '~bikeshop/category.seeder';
import { Customer } from '~bikeshop/customer.entity';
import { customerFactory } from '~bikeshop/customer.factory';
import { CustomerSeeder } from '~bikeshop/customer.seeder';
import { Product } from '~bikeshop/product.entity';
import { productFactory } from '~bikeshop/product.factory';
import { ProductSeeder } from '~bikeshop/product.seeder';
import { Stock } from '~bikeshop/stock.entity';
import { Store } from '~bikeshop/store.entity';
import { storeFactory } from '~bikeshop/store.factory';
import { StoreSeeder } from '~bikeshop/store.seeder';

export const options = {
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  entities: [Brand, Category, Product, Customer, Store, Stock],
  migrations: [
    CreateBrandsTable,
    CreateCategoriesTable,
    CreateProductsTable,
    CreateCustomersTable,
    CreateStoresTable,
    CreateStocksTable,
  ],
  factories: [
    brandFactory,
    categoryFactory,
    productFactory,
    customerFactory,
    storeFactory,
  ],
  seeds: [
    BrandSeeder,
    CategorySeeder,
    ProductSeeder,
    CustomerSeeder,
    StoreSeeder,
  ],
} satisfies DataSourceOptions & SeederOptions;

export default new DataSource(options);
