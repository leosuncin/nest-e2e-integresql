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
});
