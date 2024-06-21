import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { Brand } from '~bikeshop/brand.entity';
import { BrandService } from '~bikeshop/brand.service';
import { CastBrandPipe } from '~bikeshop/cast-brand.pipe';

describe('CastBrandPipe', () => {
  let pipe: CastBrandPipe;
  let mockedService: jest.Mocked<BrandService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BrandService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        CastBrandPipe,
      ],
    }).compile();

    mockedService = module.get(BrandService);
    pipe = module.get(CastBrandPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should cast the id parameter to a Brand', async () => {
    const id = 1n;

    mockedService.findOne.mockResolvedValue({ id, name: 'Brand' });

    await expect(pipe.transform(id)).resolves.toStrictEqual({
      id,
      name: 'Brand',
    } satisfies Brand);
  });

  it('should throw an error if the Brand is not found', async () => {
    const id = 1n;

    mockedService.findOne.mockRejectedValueOnce(
      new EntityNotFoundError(Brand, { id }),
    );

    await expect(pipe.transform(id)).rejects.toThrow();
  });
});
