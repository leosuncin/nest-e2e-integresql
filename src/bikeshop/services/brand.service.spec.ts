import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
});
