import { Test, TestingModule } from '@nestjs/testing';

import { CreateStore } from '~bikeshop/create-store.dto';
import { StoreController } from '~bikeshop/store.controller';
import { Store } from '~bikeshop/store.entity';
import { StoreService } from '~bikeshop/store.service';

describe('StoreController', () => {
  let controller: StoreController;
  let mockedService: jest.Mocked<StoreService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    mockedService = module.get(StoreService);
    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    mockedService.create.mockResolvedValue(createdStore);

    await expect(controller.create(newStore)).resolves.toStrictEqual(
      createdStore,
    );
  });
});
