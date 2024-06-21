import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { CreateBrand } from '~bikeshop/create-brand.dto';

describe('BrandService', () => {
  let service: BrandService;
  let mockedRepository: jest.Mocked<Repository<Brand>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Brand),
          useFactory() {
            return {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
              findOneByOrFail: jest.fn(),
            };
          },
        },
        BrandService,
      ],
    }).compile();

    mockedRepository = module.get(getRepositoryToken(Brand));
    service = module.get<BrandService>(BrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new brand', async () => {
    const newBrand: CreateBrand = { name: 'Brand' };
    const createdBrand: Brand = { id: 1n, ...newBrand };

    mockedRepository.create.mockReturnValue(createdBrand);
    mockedRepository.save.mockResolvedValue(createdBrand);

    await expect(service.create(newBrand)).resolves.toStrictEqual(createdBrand);
  });

  it('should find all brands', async () => {
    const brands: Brand[] = [{ id: 1n, name: 'Brand' }];

    mockedRepository.find.mockResolvedValue(brands);

    await expect(service.findAll()).resolves.toStrictEqual(brands);
  });

  it('should find a brand by id', async () => {
    const brand: Brand = { id: 1n, name: 'Brand' };

    mockedRepository.findOneByOrFail.mockResolvedValueOnce(brand);

    await expect(service.findOne(1n)).resolves.toStrictEqual(brand);
  });

  it('should throw an error when brand is not found', async () => {
    mockedRepository.findOneByOrFail.mockRejectedValue(
      new EntityNotFoundError(Brand, { id: 404n }),
    );

    await expect(service.findOne(404n)).rejects.toThrow();
  });
});
