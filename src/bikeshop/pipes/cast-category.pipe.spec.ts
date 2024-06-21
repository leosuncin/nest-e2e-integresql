import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { Category } from '~bikeshop/category.entity';
import { CategoryService } from '~bikeshop/category.service';
import { CastCategoryPipe } from '~bikeshop/cast-category.pipe';

describe('CastCategoryPipe', () => {
  let pipe: CastCategoryPipe;
  let mockedService: jest.Mocked<CategoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        CastCategoryPipe,
      ],
    }).compile();

    mockedService = module.get(CategoryService);
    pipe = module.get(CastCategoryPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should cast the id parameter to a Category', async () => {
    const id = 1n;

    mockedService.findOne.mockResolvedValue({ id, name: 'Category' });

    await expect(pipe.transform(id)).resolves.toStrictEqual({
      id,
      name: 'Category',
    } satisfies Category);
  });

  it('should throw an error if the Category is not found', async () => {
    const id = 1n;

    mockedService.findOne.mockRejectedValueOnce(
      new EntityNotFoundError(Category, { id }),
    );

    await expect(pipe.transform(id)).rejects.toThrow();
  });
});
