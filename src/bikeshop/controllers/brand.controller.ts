import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { CastBrandPipe } from '~bikeshop/cast-brand.pipe';
import { CreateBrand } from '~bikeshop/create-brand.dto';
import { UpdateBrand } from '~bikeshop/update-brand.dto';
import { EntityNotFoundFilter } from '~common/entity-not-found.filter';
import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(@Body(ValidationPipe) newBrand: CreateBrand) {
    return this.brandService.create(newBrand);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @UseFilters(EntityNotFoundFilter)
  update(
    @Param('id', ParseBigIntPipe, CastBrandPipe) brand: Brand,
    @Body(ValidationPipe) brandChanges: UpdateBrand,
  ) {
    return this.brandService.update(brand, brandChanges);
  }

  @Delete(':id')
  @UseFilters(EntityNotFoundFilter)
  remove(@Param('id', ParseBigIntPipe, CastBrandPipe) brand: Brand) {
    return this.brandService.remove(brand);
  }
}
