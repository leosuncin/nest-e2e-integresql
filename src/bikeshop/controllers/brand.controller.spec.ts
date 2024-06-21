import { Test, TestingModule } from '@nestjs/testing';

import { BrandController } from '~bikeshop/brand.controller';
import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { CreateBrand } from '~bikeshop/create-brand.dto';

describe('BrandController', () => {
  let controller: BrandController;
  let mockedService: jest.Mocked<BrandService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        {
          provide: BrandService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    mockedService = module.get(BrandService);
    controller = module.get<BrandController>(BrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new brand', async () => {
    const newBrand: CreateBrand = { name: 'Brand' };
    const createdBrand: Brand = { id: 1n, ...newBrand };

    mockedService.create.mockResolvedValue(createdBrand);

    await expect(controller.create(newBrand)).resolves.toStrictEqual(
      createdBrand,
    );
  });

  it('should find all brands', async () => {
    const brands: Brand[] = [{ id: 1n, name: 'Brand' }];

    mockedService.findAll.mockResolvedValue(brands);

    await expect(controller.findAll()).resolves.toStrictEqual(brands);
  });
});
