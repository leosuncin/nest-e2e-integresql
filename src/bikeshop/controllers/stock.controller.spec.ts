import { Test, TestingModule } from '@nestjs/testing';

import { CreateStock } from '~bikeshop/create-stock.dto';
import { StockController } from '~bikeshop/stock.controller';
import { Stock } from '~bikeshop/stock.entity';
import { StockService } from '~bikeshop/stock.service';

describe('StockController', () => {
  let controller: StockController;
  let mockedService: jest.Mocked<StockService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: StockService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    mockedService = module.get(StockService);
    controller = module.get<StockController>(StockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new stock', async () => {
    const newStock: CreateStock = {
      // @ts-expect-error foreign key
      product: '1',
      // @ts-expect-error foreign key
      store: '1',
      quantity: 100,
    };
    const createdStock: Stock = { ...newStock, productId: 1n, storeId: 1n };

    mockedService.create.mockResolvedValue(createdStock);

    await expect(controller.create(newStock)).resolves.toStrictEqual(
      createdStock,
    );
  });

  it('should find all stocks', async () => {
    const stocks: Stock[] = [
      {
        // @ts-expect-error foreign key
        product: '1',
        productId: 1n,
        // @ts-expect-error foreign key
        store: '1',
        storeId: 1n,
        quantity: 100,
      },
    ];

    mockedService.findAll.mockResolvedValue(stocks);

    await expect(controller.findAll()).resolves.toStrictEqual(stocks);
  });

  it('should find a stock by id', async () => {
    const stock: Stock = {
      product: {
        id: 1n,
        name: 'Product',
        modelYear: 2024,
        listPrice: 99.99,
        // @ts-expect-error foreign key
        brand: 1n,
        brandId: 1n,
        // @ts-expect-error foreign key
        category: 1n,
        categoryId: 1n,
      },
      productId: 1n,
      store: {
        id: 1n,
        name: 'Reichert, Daugherty and Kreiger Bikes',
        email: 'reichert.daugherty.kreiger@bike.shop',
        phone: '+595 528-0109',
        street: '4812 Bobby Lodge',
        city: 'Joannieberg',
        state: 'Wisconsin',
        zipCode: '99053',
      },
      storeId: 1n,
      quantity: 100,
    };

    mockedService.findOne.mockResolvedValue(stock);

    await expect(controller.findOne(1n, 1n)).resolves.toStrictEqual(stock);
  });
});
