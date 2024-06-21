import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { BrandController } from '~bikeshop/brand.controller';
import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { CreateBrand } from '~bikeshop/create-brand.dto';
import { UpdateBrand } from '~bikeshop/update-brand.dto';

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
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
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

  it('should find a brand by id', async () => {
    const brand: Brand = { id: 1n, name: 'Brand' };

    mockedService.findOne.mockResolvedValue(brand);

    await expect(controller.findOne(1n)).resolves.toStrictEqual(brand);
  });

  it('should throw an error if brand not found', async () => {
    mockedService.findOne.mockRejectedValue(
      new EntityNotFoundError(Brand, { id: 404n }),
    );

    await expect(controller.findOne(404n)).rejects.toThrow();
  });

  it('should update a brand', async () => {
    const brandChanges: UpdateBrand = { name: 'New Brand' };
    const updatedBrand: Brand = { id: 1n, name: 'New Brand' };

    mockedService.update.mockResolvedValue(updatedBrand);

    await expect(controller.update(1n, brandChanges)).resolves.toStrictEqual(
      updatedBrand,
    );
  });

  it('should remove a brand', async () => {
    const brand: Brand = { id: 1n, name: 'Brand' };

    mockedService.remove.mockResolvedValue(brand);

    await expect(controller.remove(1n)).resolves.toStrictEqual(brand);
  });
});
