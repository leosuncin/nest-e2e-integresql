import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { Customer } from '~bikeshop/customer.entity';
import { CustomerService } from '~bikeshop/customer.service';
import { UpdateCustomer } from '~bikeshop/update-customer.dto';

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
              findOneByOrFail: jest.fn(),
              merge: Object.assign,
              remove: jest.fn(),
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

  it('should find a customer by id', async () => {
    const customer: Customer = {
      id: 1n,
      firstName: 'Kiara',
      lastName: 'Katelynn',
      email: 'kiara_katelynn@hotmail.com',
      phone: '(471) 802-0544',
      street: '8639 Webster Underpass',
      city: 'East Kellie',
      state: 'South Dakota',
      zipCode: '57070',
    };

    mockedRepository.findOneByOrFail.mockResolvedValueOnce(customer);

    await expect(service.findOne(1n)).resolves.toStrictEqual(customer);
  });

  it('should throw an error when customer is not found', async () => {
    mockedRepository.findOneByOrFail.mockRejectedValue(
      new EntityNotFoundError(Customer, { id: 404n }),
    );

    await expect(service.findOne(404n)).rejects.toThrow();
  });

  it('should update a customer', async () => {
    const customerChanges: UpdateCustomer = {
      email: 'kiara_katelynn92@gmail.com',
    };
    const customer: Customer = {
      id: 1n,
      firstName: 'Kiara',
      lastName: 'Katelynn',
      email: 'kiara_katelynn@hotmail.com',
      phone: '(471) 802-0544',
      street: '8639 Webster Underpass',
      city: 'East Kellie',
      state: 'South Dakota',
      zipCode: '57070',
    };
    const updatedCustomer: Customer = { ...customer, ...customerChanges };

    mockedRepository.save.mockResolvedValue(updatedCustomer);

    await expect(
      service.update(customer, customerChanges),
    ).resolves.toStrictEqual(updatedCustomer);
  });

  it('should remove a customer', async () => {
    const customer: Customer = {
      id: 1n,
      firstName: 'Kiara',
      lastName: 'Katelynn',
      email: 'kiara_katelynn@hotmail.com',
      phone: '(471) 802-0544',
      street: '8639 Webster Underpass',
      city: 'East Kellie',
      state: 'South Dakota',
      zipCode: '57070',
    };

    mockedRepository.remove.mockResolvedValueOnce(customer);

    await expect(service.remove(customer)).resolves.toStrictEqual(customer);
  });
});
