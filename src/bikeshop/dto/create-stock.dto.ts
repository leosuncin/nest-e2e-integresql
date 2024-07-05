import {
  IsDefined,
  IsInt,
  IsNumber,
  IsNumberString,
  Min,
} from 'class-validator';

import { IsForeignKey } from '~bikeshop/is-foreign-key.validator';
import { Product } from '~bikeshop/product.entity';
import { Store } from '~bikeshop/store.entity';

export class CreateStock {
  @IsDefined()
  @IsNumberString()
  @IsForeignKey(Product)
  readonly product!: Product;

  @IsDefined()
  @IsNumberString()
  @IsForeignKey(Store)
  readonly store!: Store;

  @IsDefined()
  @IsNumber()
  @IsInt()
  @Min(0)
  readonly quantity!: number;
}
