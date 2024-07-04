import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandController } from '~bikeshop/brand.controller';
import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { CategoryController } from '~bikeshop/category.controller';
import { Category } from '~bikeshop/category.entity';
import { CategoryService } from '~bikeshop/category.service';
import { CustomerController } from '~bikeshop/customer.controller';
import { Customer } from '~bikeshop/customer.entity';
import { CustomerService } from '~bikeshop/customer.service';
import { IsForeignKeyConstraint } from '~bikeshop/is-foreign-key.validator';
import { ProductController } from '~bikeshop/product.controller';
import { Product } from '~bikeshop/product.entity';
import { ProductService } from '~bikeshop/product.service';
import { Store } from '~bikeshop/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, Category, Product, Customer, Store]),
  ],
  providers: [
    BrandService,
    CategoryService,
    ProductService,
    IsForeignKeyConstraint,
    CustomerService,
  ],
  controllers: [
    BrandController,
    CategoryController,
    ProductController,
    CustomerController,
  ],
})
export class BikeshopModule {}
