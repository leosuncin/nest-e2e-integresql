import { Injectable, PipeTransform } from '@nestjs/common';

import { StoreService } from '~bikeshop/store.service';

@Injectable()
export class CastStorePipe implements PipeTransform {
  constructor(private readonly storeService: StoreService) {}

  transform(value: bigint) {
    return this.storeService.findOne(value);
  }
}
