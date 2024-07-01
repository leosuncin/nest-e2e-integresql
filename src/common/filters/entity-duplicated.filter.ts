import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class EntityDuplicatedFilter
  implements ExceptionFilter<QueryFailedError>
{
  #constraintDuplicated =
    /Key \((?<property>.+)\)=\((?<value>.+)\) already exists./;

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (this.#isDuplicateError(exception.driverError)) {
      const { property, value } =
        this.#constraintDuplicated.exec(exception.driverError.detail)?.groups ??
        {};

      return response.status(HttpStatus.CONFLICT).json({
        error: 'Conflict',
        message: `The ${property} ${value} already exists`,
        statusCode: HttpStatus.CONFLICT,
      });
    }

    throw exception;
  }

  #isDuplicateError(
    error: Error | Record<string, unknown>,
  ): error is { code: '23505'; detail: string } {
    return 'code' in error && error.code == '23505';
  }
}
