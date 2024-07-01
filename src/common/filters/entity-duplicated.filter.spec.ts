import { ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import { EntityDuplicatedFilter } from '~common/entity-duplicated.filter';

describe('EntityDuplicatedFilter', () => {
  class MockDriverError extends Error {
    detail: string;

    constructor(
      public code: '23505',
      property: string,
      value: string,
    ) {
      const detail = `Key (${property})=(${value}) already exists.`;

      super(detail);

      this.detail = detail;
    }
  }

  it('should be defined', () => {
    expect(new EntityDuplicatedFilter()).toBeDefined();
  });

  it('should catch an EntityNotFoundError', () => {
    const filter = new EntityDuplicatedFilter();
    const exception = new QueryFailedError(
      '',
      [],
      new MockDriverError('23505', 'email', 'john@doe.me'),
    );
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status,
          json,
        }),
      }),
    };

    filter.catch(exception, host as ArgumentsHost);

    expect(host.switchToHttp().getResponse().status).toHaveBeenCalledWith(409);
    expect(host.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      error: 'Conflict',
      message: 'The email john@doe.me already exists',
      statusCode: 409,
    });
  });
});
