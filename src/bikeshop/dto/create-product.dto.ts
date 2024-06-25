import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import type { Brand } from '~bikeshop/brand.entity';
import type { Category } from '~bikeshop/category.entity';

export class CreateProduct {
  @IsDefined()
  @IsString()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name!: string;

  @IsDefined()
  @IsNumber()
  @IsInt()
  @Min(1970)
  readonly modelYear!: number;

  @IsDefined()
  @IsNumber()
  @Min(0.01)
  readonly listPrice!: number;

  @IsDefined()
  @IsNumberString()
  readonly brand!: Brand;

  @IsDefined()
  @IsNumberString()
  readonly category!: Category;
}
