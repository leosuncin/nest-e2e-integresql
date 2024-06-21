import { PartialType } from '@nestjs/mapped-types';

import { CreateBrand } from '~bikeshop/create-brand.dto';

export class UpdateBrand extends PartialType(CreateBrand) {}
