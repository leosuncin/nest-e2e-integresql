import { Test, TestingModule } from '@nestjs/testing';

import { CreateCustomer } from '~bikeshop/create-customer.dto';
import { CustomerController } from '~bikeshop/customer.controller';
import { Customer } from '~bikeshop/customer.entity';
import { CustomerService } from '~bikeshop/customer.service';

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
});
