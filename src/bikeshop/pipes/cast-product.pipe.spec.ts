import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { CastProductPipe } from '~bikeshop/cast-product.pipe';
import { Product } from '~bikeshop/product.entity';
import { ProductService } from '~bikeshop/product.service';

describe('CastProductPipe', () => {
  let pipe: CastProductPipe;
  let mockedService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        CastProductPipe,
      ],
    }).compile();

    mockedService = module.get(ProductService);
    pipe = module.get(CastProductPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should cast the id parameter to a Product', async () => {
    const id = 1n;

    mockedService.findOne.mockResolvedValue({
      id,
      name: 'Product',
      modelYear: 2024,
      listPrice: 99.99,
      // @ts-expect-error foreign key
      brand: 1n,
      brandId: 1n,
      // @ts-expect-error foreign key
      category: 1n,
      categoryId: 1n,
    });

    await expect(pipe.transform(id)).resolves.toStrictEqual({
      id,
      name: 'Product',
      modelYear: 2024,
      listPrice: 99.99,
      // @ts-expect-error foreign key
      brand: 1n,
      brandId: 1n,
      // @ts-expect-error foreign key
      category: 1n,
      categoryId: 1n,
    } satisfies Product);
  });

  it('should throw an error if the Product is not found', async () => {
    const id = 404n;

    mockedService.findOne.mockRejectedValueOnce(
      new EntityNotFoundError(Product, { id }),
    );

    await expect(pipe.transform(id)).rejects.toThrow();
  });
});
