import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { CategoryController } from '~bikeshop/category.controller';
import { Category } from '~bikeshop/category.entity';
import { CategoryService } from '~bikeshop/category.service';
import { CreateCategory } from '~bikeshop/create-category.dto';
import { UpdateCategory } from '~bikeshop/update-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let mockedService: jest.Mocked<CategoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
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

    mockedService = module.get(CategoryService);
    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new category', async () => {
    const newCategory: CreateCategory = { name: 'Category' };
    const createdCategory: Category = { id: 1n, ...newCategory };

    mockedService.create.mockResolvedValue(createdCategory);

    await expect(controller.create(newCategory)).resolves.toStrictEqual(
      createdCategory,
    );
  });

  it('should find all categories', async () => {
    const categorys: Category[] = [{ id: 1n, name: 'Category' }];

    mockedService.findAll.mockResolvedValue(categorys);

    await expect(controller.findAll()).resolves.toStrictEqual(categorys);
  });

  it('should find a category by id', async () => {
    const category: Category = { id: 1n, name: 'Category' };

    mockedService.findOne.mockResolvedValue(category);

    await expect(controller.findOne(1n)).resolves.toStrictEqual(category);
  });

  it('should throw an error if category not found', async () => {
    mockedService.findOne.mockRejectedValue(
      new EntityNotFoundError(Category, { id: 404n }),
    );

    await expect(controller.findOne(404n)).rejects.toThrow();
  });

  it('should update a category', async () => {
    const categoryChanges: UpdateCategory = { name: 'New Category' };
    const category: Category = { id: 1n, name: 'Category' };
    const updatedCategory: Category = { id: 1n, name: 'New Category' };

    mockedService.update.mockResolvedValue(updatedCategory);

    await expect(
      controller.update(category, categoryChanges),
    ).resolves.toStrictEqual(updatedCategory);
  });

  it('should remove a category', async () => {
    const category: Category = { id: 1n, name: 'Category' };

    mockedService.remove.mockResolvedValue(category);

    await expect(controller.remove(category)).resolves.toStrictEqual(category);
  });
});
