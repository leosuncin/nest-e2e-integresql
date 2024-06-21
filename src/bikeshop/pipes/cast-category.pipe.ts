import { Injectable, PipeTransform } from '@nestjs/common';

import { CategoryService } from '~bikeshop/category.service';

@Injectable()
export class CastCategoryPipe implements PipeTransform {
  constructor(private readonly categoryService: CategoryService) {}

  transform(value: bigint) {
    return this.categoryService.findOne(value);
  }
}
