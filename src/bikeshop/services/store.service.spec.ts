import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStore } from '~bikeshop/create-store.dto';
import { Store } from '~bikeshop/store.entity';
import { StoreService } from '~bikeshop/store.service';

describe('StoreService', () => {
  let service: StoreService;
  let mockedRepository: jest.Mocked<Repository<Store>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Store),
          useFactory() {
            return {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
            };
          },
        },
        StoreService,
      ],
    }).compile();

    mockedRepository = module.get(getRepositoryToken(Store));
    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new store', async () => {
    const newStore: CreateStore = {
      name: 'Reichert, Daugherty and Kreiger Bikes',
      email: 'reichert.daugherty.kreiger@bike.shop',
      phone: '+595 528-0109',
      street: '4812 Bobby Lodge',
      city: 'Joannieberg',
      state: 'Wisconsin',
      zipCode: '99053',
    };
    const createdStore: Store = { id: 1n, ...newStore };

    mockedRepository.create.mockReturnValue(createdStore);
    mockedRepository.save.mockResolvedValue(createdStore);

    await expect(service.create(newStore)).resolves.toStrictEqual(createdStore);
  });

  it('should find all the stores', async () => {
    const stores: Store[] = [
      {
        id: 1n,
        name: 'Reichert, Daugherty and Kreiger Bikes',
        email: 'reichert.daugherty.kreiger@bike.shop',
        phone: '+595 528-0109',
        street: '4812 Bobby Lodge',
        city: 'Joannieberg',
        state: 'Wisconsin',
        zipCode: '99053',
      },
    ];

    mockedRepository.find.mockResolvedValue(stores);

    await expect(service.findAll()).resolves.toStrictEqual(stores);
  });
});
