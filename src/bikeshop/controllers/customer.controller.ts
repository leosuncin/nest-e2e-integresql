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

import { CastCustomerPipe } from '~bikeshop/cast-customer.pipe';
import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { Customer } from '~bikeshop/customer.entity';
import { CustomerService } from '~bikeshop/customer.service';
import { UpdateCustomer } from '~bikeshop/update-customer.dto';
import { EntityNotFoundFilter } from '~common/entity-not-found.filter';
import { EntityDuplicatedFilter } from '~common/entity-duplicated.filter';
import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseFilters(EntityDuplicatedFilter)
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
  @UseFilters(EntityNotFoundFilter, EntityDuplicatedFilter)
  update(
    @Param('id', ParseBigIntPipe, CastCustomerPipe) customer: Customer,
    @Body(ValidationPipe) customerChanges: UpdateCustomer,
  ) {
    return this.customerService.update(customer, customerChanges);
  }

  @Delete(':id')
  @UseFilters(EntityNotFoundFilter)
  remove(@Param('id', ParseBigIntPipe, CastCustomerPipe) customer: Customer) {
    return this.customerService.remove(customer);
  }
}
