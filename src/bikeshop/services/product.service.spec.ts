import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

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
              find: jest.fn(),
              findOneByOrFail: jest.fn(),
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

  it('should find all products', async () => {
    const products: Product[] = [
      {
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
    ];

    mockedRepository.find.mockResolvedValue(products);

    await expect(service.findAll()).resolves.toStrictEqual(products);
  });

  it('should find a product by id', async () => {
    const product: Product = {
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
    };

    mockedRepository.findOneByOrFail.mockResolvedValueOnce(product);

    await expect(service.findOne(1n)).resolves.toStrictEqual(product);
  });

  it('should throw an error when product is not found', async () => {
    mockedRepository.findOneByOrFail.mockRejectedValue(
      new EntityNotFoundError(Product, { id: 404n }),
    );

    await expect(service.findOne(404n)).rejects.toThrow();
  });
});