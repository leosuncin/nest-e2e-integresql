import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { CreateProduct } from '~bikeshop/create-product.dto';
import { ProductController } from '~bikeshop/product.controller';
import { Product } from '~bikeshop/product.entity';
import { ProductService } from '~bikeshop/product.service';
import { UpdateProduct } from '~bikeshop/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let mockedService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    mockedService = module.get(ProductService);
    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    mockedService.create.mockResolvedValue(createdProduct);

    await expect(controller.create(newProduct)).resolves.toStrictEqual(
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

    mockedService.findAll.mockResolvedValue(products);

    await expect(controller.findAll()).resolves.toStrictEqual(products);
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

    mockedService.findOne.mockResolvedValue(product);

    await expect(controller.findOne(1n)).resolves.toStrictEqual(product);
  });

  it('should throw an error if product not found', async () => {
    mockedService.findOne.mockRejectedValue(
      new EntityNotFoundError(Product, { id: 404n }),
    );

    await expect(controller.findOne(404n)).rejects.toThrow();
  });

  it('should update a product', async () => {
    const productChanges: UpdateProduct = { name: 'New Product' };
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
    const updatedProduct: Product = { ...product, ...productChanges };

    mockedService.update.mockResolvedValue(updatedProduct);

    await expect(
      controller.update(product, productChanges),
    ).resolves.toStrictEqual(updatedProduct);
  });
});
