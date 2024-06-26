import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';

import { CreateProduct } from '~bikeshop/create-product.dto';
import { ProductService } from '~bikeshop/product.service';

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
}
