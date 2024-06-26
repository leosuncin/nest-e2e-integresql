import { Test, TestingModule } from '@nestjs/testing';

import { CreateProduct } from '~bikeshop/create-product.dto';
import { ProductController } from '~bikeshop/product.controller';
import { Product } from '~bikeshop/product.entity';
import { ProductService } from '~bikeshop/product.service';

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
});
