import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { CastCustomerPipe } from '~bikeshop/cast-customer.pipe';
import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { Customer } from '~bikeshop/customer.entity';
import { CustomerService } from '~bikeshop/customer.service';
import { UpdateCustomer } from '~bikeshop/update-customer.dto';
import { EntityNotFoundFilter } from '~common/entity-not-found.filter';
import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body(ValidationPipe) newCustomer: CreateCustomer) {
    return this.customerService.create(newCustomer);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @UseFilters(EntityNotFoundFilter)
  update(
    @Param('id', ParseBigIntPipe, CastCustomerPipe) customer: Customer,
    @Body(ValidationPipe) customerChanges: UpdateCustomer,
  ) {
    return this.customerService.update(customer, customerChanges);
  }
}
