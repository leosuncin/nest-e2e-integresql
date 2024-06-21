import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandController } from '~bikeshop/brand.controller';
import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { CategoryController } from '~bikeshop/category.controller';
import { Category } from '~bikeshop/category.entity';
import { CategoryService } from '~bikeshop/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category])],
  providers: [BrandService, CategoryService],
  controllers: [BrandController, CategoryController],
})
export class BikeshopModule {}
