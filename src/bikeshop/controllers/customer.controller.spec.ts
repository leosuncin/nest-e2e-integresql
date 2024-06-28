import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { CustomerController } from '~bikeshop/customer.controller';
import { Customer } from '~bikeshop/customer.entity';
import { CustomerService } from '~bikeshop/customer.service';
import { UpdateCustomer } from '~bikeshop/update-customer.dto';

describe('CustomerController', () => {
  let controller: CustomerController;
  let mockedService: jest.Mocked<CustomerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    mockedService = module.get(CustomerService);
    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    mockedService.create.mockResolvedValue(createdCustomer);

    await expect(controller.create(newCustomer)).resolves.toStrictEqual(
      createdCustomer,
    );
  });

  it('should find all customers', async () => {
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

    mockedService.findAll.mockResolvedValue(customers);

    await expect(controller.findAll()).resolves.toStrictEqual(customers);
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

    mockedService.findOne.mockResolvedValue(customer);

    await expect(controller.findOne(1n)).resolves.toStrictEqual(customer);
  });

  it('should throw an error if the customer was not found', async () => {
    mockedService.findOne.mockRejectedValue(
      new EntityNotFoundError(Customer, { id: 404n }),
    );

    await expect(controller.findOne(404n)).rejects.toThrow();
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

    mockedService.update.mockResolvedValue(updatedCustomer);

    await expect(
      controller.update(customer, customerChanges),
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

    mockedService.remove.mockResolvedValue(customer);

    await expect(controller.remove(customer)).resolves.toStrictEqual(customer);
  });
});
