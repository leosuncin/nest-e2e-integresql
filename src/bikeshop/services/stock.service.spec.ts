import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStock } from '~bikeshop/create-stock.dto';
import { Stock } from '~bikeshop/stock.entity';
import { StockService } from '~bikeshop/stock.service';

describe('StockService', () => {
  let service: StockService;
  let mockedRepository: jest.Mocked<Repository<Stock>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Stock),
          useFactory() {
            return {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
            };
          },
        },
        StockService,
      ],
    }).compile();

    mockedRepository = module.get(getRepositoryToken(Stock));
    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    mockedRepository.create.mockReturnValue(createdStock);
    mockedRepository.save.mockResolvedValue(createdStock);

    await expect(service.create(newStock)).resolves.toStrictEqual(createdStock);
  });

  it('should find all the stocks', async () => {
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

    mockedRepository.find.mockResolvedValue(stocks);

    await expect(service.findAll()).resolves.toStrictEqual(stocks);
  });
});
