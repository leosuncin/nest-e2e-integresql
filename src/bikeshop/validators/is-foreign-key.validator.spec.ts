import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { useContainer, validate } from 'class-validator';
import { EntityManager } from 'typeorm';

import {
  IsForeignKey,
  IsForeignKeyConstraint,
} from '~bikeshop/is-foreign-key.validator';

describe('IsForeignKeyConstraint', () => {
  let constraint: IsForeignKeyConstraint;
  let mockedEntityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getEntityManagerToken(),
          useValue: {
            existsBy: jest.fn(),
          },
        },
        IsForeignKeyConstraint,
      ],
    }).compile();

    constraint = module.get<IsForeignKeyConstraint>(IsForeignKeyConstraint);
    mockedEntityManager = module.get(getEntityManagerToken());
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
  });

  it('should validate when the foreign key exists', async () => {
    mockedEntityManager.existsBy.mockResolvedValueOnce(true);

    await expect(
      // @ts-expect-error mock ValidationArgument
      constraint.validate('1', { constraints: [class Mock {}] }),
    ).resolves.toBe(true);
  });

  it('should pass when the value is not a number string', () => {
    // @ts-expect-error mock ValidationArgument
    expect(constraint.validate('o', { constraints: [class Mock {}] })).toBe(
      true,
    );
  });

  it('should throw when no entity was passed', () => {
    // @ts-expect-error mock ValidationArgument
    expect(() => constraint.validate('1', { constraints: [] })).toThrow();
  });
});

describe('IsForeignKey validator', () => {
  let mockedEntityManager: jest.Mocked<EntityManager>;
  class Mock {
    @IsForeignKey(Mock)
    fk!: string;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getEntityManagerToken(),
          useValue: {
            existsBy: jest.fn(),
          },
        },
        IsForeignKeyConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });
    mockedEntityManager = module.get(getEntityManagerToken());
  });

  it('should validate when the foreign key exists', async () => {
    const mock = new Mock();
    mock.fk = '1';
    mockedEntityManager.existsBy.mockResolvedValueOnce(true);

    await expect(validate(mock)).resolves.toHaveLength(0);
  });

  it('should validate when the foreign key no exists', async () => {
    const mock = new Mock();
    mock.fk = '404';
    mockedEntityManager.existsBy.mockResolvedValueOnce(false);

    const errors = await validate(mock);

    expect(errors).toHaveLength(1);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          constraints: { isForeignKey: 'The 404 is not a valid Mock.' },
        }),
      ]),
    );
  });
});
