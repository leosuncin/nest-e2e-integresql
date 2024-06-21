import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

import { BrandService } from '~bikeshop/brand.service';
import { CreateBrand } from '~bikeshop/create-brand.dto';
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
  async findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    try {
      return await this.brandService.findOne(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Brand with id ${id} not found`);
      }

      throw error;
    }
  }
}
