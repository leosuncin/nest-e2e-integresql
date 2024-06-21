import { BadRequestException } from '@nestjs/common';

import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

describe('ParseBigIntPipe', () => {
  it('should be defined', () => {
    expect(new ParseBigIntPipe()).toBeDefined();
  });

  it('should parse a string to a BigInt', () => {
    const pipe = new ParseBigIntPipe();

    expect(pipe.transform('123')).toBe(123n);
  });

  it('should throw an exception if the value is not a number string', () => {
    const pipe = new ParseBigIntPipe();

    expect(() => pipe.transform('abc')).toThrow(BadRequestException);
  });
});
