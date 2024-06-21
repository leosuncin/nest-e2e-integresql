import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandController } from '~bikeshop/brand.controller';
import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { Category } from '~bikeshop/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category])],
  providers: [BrandService],
  controllers: [BrandController],
})
export class BikeshopModule {}
