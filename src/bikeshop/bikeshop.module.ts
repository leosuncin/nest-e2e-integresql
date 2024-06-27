import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandController } from '~bikeshop/brand.controller';
import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { CategoryController } from '~bikeshop/category.controller';
import { Category } from '~bikeshop/category.entity';
import { CategoryService } from '~bikeshop/category.service';
import { ProductController } from '~bikeshop/product.controller';
import { Product } from '~bikeshop/product.entity';
import { ProductService } from '~bikeshop/product.service';
import { IsForeignKeyConstraint } from '~bikeshop/is-foreign-key.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category, Product])],
  providers: [
    BrandService,
    CategoryService,
    ProductService,
    IsForeignKeyConstraint,
  ],
  controllers: [BrandController, CategoryController, ProductController],
})
export class BikeshopModule {}
