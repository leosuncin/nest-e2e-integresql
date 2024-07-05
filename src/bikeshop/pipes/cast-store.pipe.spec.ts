import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import { CastStorePipe } from '~bikeshop/cast-store.pipe';
import { Store } from '~bikeshop/store.entity';
import { StoreService } from '~bikeshop/store.service';

describe('CastStorePipe', () => {
  let pipe: CastStorePipe;
  let mockedService: jest.Mocked<StoreService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StoreService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        CastStorePipe,
      ],
    }).compile();

    mockedService = module.get(StoreService);
    pipe = module.get(CastStorePipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should cast the id parameter to a Store', async () => {
    const id = 1n;

    mockedService.findOne.mockResolvedValue({
      id,
      name: 'Reichert, Daugherty and Kreiger Bikes',
      email: 'reichert.daugherty.kreiger@bike.shop',
      phone: '+595 528-0109',
      street: '4812 Bobby Lodge',
      city: 'Joannieberg',
      state: 'Wisconsin',
      zipCode: '99053',
    });

    await expect(pipe.transform(id)).resolves.toStrictEqual({
      id,
      name: 'Reichert, Daugherty and Kreiger Bikes',
      email: 'reichert.daugherty.kreiger@bike.shop',
      phone: '+595 528-0109',
      street: '4812 Bobby Lodge',
      city: 'Joannieberg',
      state: 'Wisconsin',
      zipCode: '99053',
    } satisfies Store);
  });

  it('should throw an error if the Store is not found', async () => {
    const id = 1n;

    mockedService.findOne.mockRejectedValueOnce(
      new EntityNotFoundError(Store, { id }),
    );

    await expect(pipe.transform(id)).rejects.toThrow();
  });
});
