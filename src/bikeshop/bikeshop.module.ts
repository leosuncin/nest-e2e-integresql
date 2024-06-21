import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Brand } from '~bikeshop/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
})
export class BikeshopModule {}
