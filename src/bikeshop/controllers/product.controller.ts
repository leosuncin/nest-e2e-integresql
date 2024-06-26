import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { CreateProduct } from '~bikeshop/create-product.dto';
import { ProductService } from '~bikeshop/product.service';
import { EntityNotFoundFilter } from '~common/entity-not-found.filter';
import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body(ValidationPipe) newProduct: CreateProduct) {
    return this.productService.create(newProduct);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.productService.findOne(id);
  }
}
