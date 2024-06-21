import { ArgumentsHost } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

import { EntityNotFoundFilter } from '~common/entity-not-found.filter';

describe('EntityNotFoundFilter', () => {
  class Fixture {
    id = 1n;
  }

  it('should be defined', () => {
    expect(new EntityNotFoundFilter()).toBeDefined();
  });

  it('should catch an EntityNotFoundError', () => {
    const filter = new EntityNotFoundFilter();
    const exception = new EntityNotFoundError(Fixture, { id: 1n });
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

    expect(host.switchToHttp().getResponse().status).toHaveBeenCalledWith(404);
    expect(host.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      error: 'Not Found',
      message: 'Fixture with id 1 not found',
      statusCode: 404,
    });
  });
});
