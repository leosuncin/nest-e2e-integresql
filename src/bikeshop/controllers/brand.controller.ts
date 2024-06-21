import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { BrandService } from '~bikeshop/brand.service';
import { CreateBrand } from '~bikeshop/create-brand.dto';
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
}
