import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

import { Category } from '~bikeshop/category.entity';
import { CategoryService } from '~bikeshop/category.service';
import { CreateCategory } from '~bikeshop/create-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockedRepository: jest.Mocked<Repository<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Category),
          useFactory() {
            return {
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
              findOneByOrFail: jest.fn(),
            };
          },
        },
        CategoryService,
      ],
    }).compile();

    mockedRepository = module.get(getRepositoryToken(Category));
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new category', async () => {
    const newCategory: CreateCategory = { name: 'Category' };
    const createdCategory: Category = { id: 1n, ...newCategory };

    mockedRepository.create.mockReturnValue(createdCategory);
    mockedRepository.save.mockResolvedValue(createdCategory);

    await expect(service.create(newCategory)).resolves.toStrictEqual(
      createdCategory,
    );
  });

  it('should find all categories', async () => {
    const categorys: Category[] = [{ id: 1n, name: 'Category' }];

    mockedRepository.find.mockResolvedValue(categorys);

    await expect(service.findAll()).resolves.toStrictEqual(categorys);
  });

  it('should find a category by id', async () => {
    const category: Category = { id: 1n, name: 'Category' };

    mockedRepository.findOneByOrFail.mockResolvedValueOnce(category);

    await expect(service.findOne(1n)).resolves.toStrictEqual(category);
  });

  it('should throw an error when category is not found', async () => {
    mockedRepository.findOneByOrFail.mockRejectedValue(
      new EntityNotFoundError(Category, { id: 404n }),
    );

    await expect(service.findOne(404n)).rejects.toThrow();
  });
});
