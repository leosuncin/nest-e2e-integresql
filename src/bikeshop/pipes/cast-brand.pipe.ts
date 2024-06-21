import { Injectable, PipeTransform } from '@nestjs/common';

import { BrandService } from '~bikeshop/brand.service';

@Injectable()
export class CastBrandPipe implements PipeTransform {
  constructor(private readonly brandService: BrandService) {}

  transform(value: bigint) {
    return this.brandService.findOne(value);
  }
}
