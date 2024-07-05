import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter
  implements ExceptionFilter<EntityNotFoundError>
{
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    // @ts-expect-error get entity class name
    const entityName = exception.entityClass.name;
    const parameters = Object.entries(exception.criteria)
      .filter(([key]) => 'relations' !== key)
      .map(([key, value]) => {
        if (key === 'where') {
          return Object.entries(value as Record<string, string>)
            .map(([whereKey, whereValue]) => `${whereKey} = ${whereValue}`)
            .join(', ');
        }

        return `${key} ${value}`;
      })
      .join(', ');

    response.status(HttpStatus.NOT_FOUND).json({
      error: 'Not Found',
      message: `${entityName} with ${parameters} not found`,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}
