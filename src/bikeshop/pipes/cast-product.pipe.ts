import { Injectable, PipeTransform } from '@nestjs/common';

import { ProductService } from '~bikeshop/product.service';

@Injectable()
export class CastProductPipe implements PipeTransform {
  constructor(private readonly productService: ProductService) {}

  transform(value: bigint) {
    return this.productService.findOne(value);
  }
}
