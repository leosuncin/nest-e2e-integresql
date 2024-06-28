import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { CustomerService } from '~bikeshop/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body(ValidationPipe) newCustomer: CreateCustomer) {
    return this.customerService.create(newCustomer);
  }
}
