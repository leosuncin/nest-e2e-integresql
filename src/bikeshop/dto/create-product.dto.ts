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

import { Brand } from '~bikeshop/brand.entity';
import { Category } from '~bikeshop/category.entity';
import { IsForeignKey } from '~bikeshop/is-foreign-key.validator';

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
  @IsForeignKey(Brand)
  readonly brand!: Brand;

  @IsDefined()
  @IsNumberString()
  @IsForeignKey(Category)
  readonly category!: Category;
}
