import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

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
              findOneOrFail: jest.fn(),
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

  it('should find all the stock of a product', async () => {
    const stocks: Stock[] = [
      {
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
        // @ts-expect-error foreign key
        store: '1',
        storeId: 1n,
        quantity: 100,
      },
    ];

    mockedRepository.find.mockResolvedValue(stocks);

    await expect(service.findAllByProduct(1n)).resolves.toStrictEqual(stocks);
  });

  it('should find all the stock of a store', async () => {
    const stocks: Stock[] = [
      {
        // @ts-expect-error foreign key
        product: '1',
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
      },
    ];

    mockedRepository.find.mockResolvedValue(stocks);

    await expect(service.findAllByStore(1n)).resolves.toStrictEqual(stocks);
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

    mockedRepository.findOneOrFail.mockResolvedValueOnce(stock);

    await expect(service.findOne(1n, 1n)).resolves.toStrictEqual(stock);
  });

  it('should throw an error when stock is not found', async () => {
    mockedRepository.findOneOrFail.mockRejectedValue(
      new EntityNotFoundError(Stock, { id: 404n }),
    );

    await expect(service.findOne(404n, 404n)).rejects.toThrow();
  });
});
