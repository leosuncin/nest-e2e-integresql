import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { CastCustomerPipe } from '~bikeshop/cast-customer.pipe';
import { Customer } from '~bikeshop/customer.entity';
import { CustomerService } from '~bikeshop/customer.service';

describe('CastCustomerPipe', () => {
  let pipe: CastCustomerPipe;
  let mockedService: jest.Mocked<CustomerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CustomerService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        CastCustomerPipe,
      ],
    }).compile();

    mockedService = module.get(CustomerService);
    pipe = module.get(CastCustomerPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should cast the id parameter to a Customer', async () => {
    const id = 1n;

    mockedService.findOne.mockResolvedValue({
      id,
      firstName: 'Kiara',
      lastName: 'Katelynn',
      email: 'kiara_katelynn@hotmail.com',
      phone: '(471) 802-0544',
      street: '8639 Webster Underpass',
      city: 'East Kellie',
      state: 'South Dakota',
      zipCode: '57070',
    });

    await expect(pipe.transform(id)).resolves.toStrictEqual({
      id,
      firstName: 'Kiara',
      lastName: 'Katelynn',
      email: 'kiara_katelynn@hotmail.com',
      phone: '(471) 802-0544',
      street: '8639 Webster Underpass',
      city: 'East Kellie',
      state: 'South Dakota',
      zipCode: '57070',
    } satisfies Customer);
  });

  it('should throw an error if the Customer is not found', async () => {
    const id = 1n;

    mockedService.findOne.mockRejectedValueOnce(
      new EntityNotFoundError(Customer, { id }),
    );

    await expect(pipe.transform(id)).rejects.toThrow();
  });
});
