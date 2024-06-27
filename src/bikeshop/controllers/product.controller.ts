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

import { CastProductPipe } from '~bikeshop/cast-product.pipe';
import { CreateProduct } from '~bikeshop/create-product.dto';
import { Product } from '~bikeshop/product.entity';
import { ProductService } from '~bikeshop/product.service';
import { UpdateProduct } from '~bikeshop/update-product.dto';
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

  @Patch(':id')
  @UseFilters(EntityNotFoundFilter)
  update(
    @Param('id', ParseBigIntPipe, CastProductPipe) product: Product,
    @Body(ValidationPipe) productChanges: UpdateProduct,
  ) {
    return this.productService.update(product, productChanges);
  }

  @Delete(':id')
  @UseFilters(EntityNotFoundFilter)
  remove(@Param('id', ParseBigIntPipe, CastProductPipe) product: Product) {
    return this.productService.remove(product);
  }
}
