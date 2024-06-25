import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProduct } from '~bikeshop/create-product.dto';
import { Product } from '~bikeshop/product.entity';
import { ProductService } from '~bikeshop/product.service';

describe('ProductService', () => {
  let service: ProductService;
  let mockedRepository: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Product),
          useFactory() {
            return {
              create: jest.fn(),
              save: jest.fn(),
            };
          },
        },
        ProductService,
      ],
    }).compile();

    mockedRepository = module.get(getRepositoryToken(Product));
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new product', async () => {
    const newProduct: CreateProduct = {
      name: 'Product',
      modelYear: 2024,
      listPrice: 99.99,
      // @ts-expect-error foreign key
      brand: 1n,
      // @ts-expect-error foreign key
      category: 1n,
    };
    const createdProduct: Product = {
      id: 1n,
      brandId: 1n,
      categoryId: 1n,
      ...newProduct,
    };

    mockedRepository.create.mockReturnValue(createdProduct);
    mockedRepository.save.mockResolvedValue(createdProduct);

    await expect(service.create(newProduct)).resolves.toStrictEqual(
      createdProduct,
    );
  });
});
