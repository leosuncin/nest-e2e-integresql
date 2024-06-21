import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { BrandService } from '~bikeshop/brand.service';
import { CreateBrand } from '~bikeshop/create-brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(@Body(ValidationPipe) newBrand: CreateBrand) {
    return this.brandService.create(newBrand);
  }
}
