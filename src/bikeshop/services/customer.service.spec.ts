import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { Customer } from '~bikeshop/customer.entity';
import { CustomerService } from '~bikeshop/customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockedRepository: jest.Mocked<Repository<Customer>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Customer),
          useFactory() {
            return {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
            };
          },
        },
        CustomerService,
      ],
    }).compile();

    mockedRepository = module.get(getRepositoryToken(Customer));
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new customer', async () => {
    const newCustomer: CreateCustomer = {
      firstName: 'Kiara',
      lastName: 'Katelynn',
      email: 'kiara_katelynn@hotmail.com',
      phone: '(471) 802-0544',
      street: '8639 Webster Underpass',
      city: 'East Kellie',
      state: 'South Dakota',
      zipCode: '57070',
    };
    const createdCustomer: Customer = { id: 1n, ...newCustomer };

    mockedRepository.create.mockReturnValue(createdCustomer);
    mockedRepository.save.mockResolvedValue(createdCustomer);

    await expect(service.create(newCustomer)).resolves.toStrictEqual(
      createdCustomer,
    );
  });

  it('should find all the customers', async () => {
    const customers: Customer[] = [
      {
        id: 1n,
        firstName: 'Kiara',
        lastName: 'Katelynn',
        email: 'kiara_katelynn@hotmail.com',
        phone: '(471) 802-0544',
        street: '8639 Webster Underpass',
        city: 'East Kellie',
        state: 'South Dakota',
        zipCode: '57070',
      },
    ];

    mockedRepository.find.mockResolvedValue(customers);

    await expect(service.findAll()).resolves.toStrictEqual(customers);
  });
});
