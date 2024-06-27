import { PartialType } from '@nestjs/mapped-types';

import { CreateProduct } from '~bikeshop/create-product.dto';

export class UpdateProduct extends PartialType(CreateProduct) {}
