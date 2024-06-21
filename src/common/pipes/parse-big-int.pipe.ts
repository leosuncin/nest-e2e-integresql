import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isNumberString } from 'class-validator';

declare module 'class-validator' {
  export function isNumberString(value: unknown): value is string;
}

@Injectable()
export class ParseBigIntPipe implements PipeTransform {
  transform(value: unknown) {
    if (!isNumberString(value)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    return BigInt(value);
  }
}
