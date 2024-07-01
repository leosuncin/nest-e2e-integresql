import { Injectable, PipeTransform } from '@nestjs/common';

import { CustomerService } from '~bikeshop/customer.service';

@Injectable()
export class CastCustomerPipe implements PipeTransform {
  constructor(private readonly customerService: CustomerService) {}

  transform(value: bigint) {
    return this.customerService.findOne(value);
  }
}
