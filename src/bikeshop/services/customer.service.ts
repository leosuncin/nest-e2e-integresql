import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { Customer } from '~bikeshop/customer.entity';
import { UpdateCustomer } from '~bikeshop/update-customer.dto';

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

  findOne(id: bigint) {
    return this.customerRepository.findOneByOrFail({ id });
  }

  update(customer: Customer, customerChanges: UpdateCustomer) {
    this.customerRepository.merge(customer, customerChanges);

    return this.customerRepository.save(customer);
  }

  remove(customer: Customer) {
    return this.customerRepository.remove(customer);
  }
}
