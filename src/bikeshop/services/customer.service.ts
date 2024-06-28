import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { Customer } from '~bikeshop/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  create(newCustomer: CreateCustomer) {
    const customer = this.customerRepository.create(newCustomer);

    return this.customerRepository.save(customer);
  }

  findAll() {
    return this.customerRepository.find();
  }
}
