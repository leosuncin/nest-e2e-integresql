import { Test, TestingModule } from '@nestjs/testing';

import { CreateStore } from '~bikeshop/create-store.dto';
import { StoreController } from '~bikeshop/store.controller';
import { Store } from '~bikeshop/store.entity';
import { StoreService } from '~bikeshop/store.service';
import { UpdateStore } from '~bikeshop/update-store.dto';

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
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
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

  it('should find all stores', async () => {
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

    mockedService.findAll.mockResolvedValue(stores);

    await expect(controller.findAll()).resolves.toStrictEqual(stores);
  });

  it('should find a store by id', async () => {
    const store: Store = {
      id: 1n,
      name: 'Reichert, Daugherty and Kreiger Bikes',
      email: 'reichert.daugherty.kreiger@bike.shop',
      phone: '+595 528-0109',
      street: '4812 Bobby Lodge',
      city: 'Joannieberg',
      state: 'Wisconsin',
      zipCode: '99053',
    };

    mockedService.findOne.mockResolvedValue(store);

    await expect(controller.findOne(1n)).resolves.toStrictEqual(store);
  });

  it('should update a store', async () => {
    const storeChanges: UpdateStore = {
      email: 'kiara_katelynn92@gmail.com',
    };
    const store: Store = {
      id: 1n,
      name: 'Reichert, Daugherty and Kreiger Bikes',
      email: 'reichert.daugherty.kreiger@bike.shop',
      phone: '+595 528-0109',
      street: '4812 Bobby Lodge',
      city: 'Joannieberg',
      state: 'Wisconsin',
      zipCode: '99053',
    };
    const updatedStore: Store = { ...store, ...storeChanges };

    mockedService.update.mockResolvedValue(updatedStore);

    await expect(controller.update(store, storeChanges)).resolves.toStrictEqual(
      updatedStore,
    );
  });

  it('should remove a store', async () => {
    const store: Store = {
      id: 1n,
      name: 'Reichert, Daugherty and Kreiger Bikes',
      email: 'reichert.daugherty.kreiger@bike.shop',
      phone: '+595 528-0109',
      street: '4812 Bobby Lodge',
      city: 'Joannieberg',
      state: 'Wisconsin',
      zipCode: '99053',
    };

    mockedService.remove.mockResolvedValue(store);

    await expect(controller.remove(store)).resolves.toStrictEqual(store);
  });
});
