import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { CustomerService } from '~bikeshop/customer.service';
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
}
