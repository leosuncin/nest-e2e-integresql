import { Test, TestingModule } from '@nestjs/testing';

import { CategoryController } from '~bikeshop/category.controller';
import { Category } from '~bikeshop/category.entity';
import { CategoryService } from '~bikeshop/category.service';
import { CreateCategory } from '~bikeshop/create-category.dto';

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
});
