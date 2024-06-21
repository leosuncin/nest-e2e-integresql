import { PartialType } from '@nestjs/mapped-types';

import { CreateCategory } from '~bikeshop/create-category.dto';

export class UpdateCategory extends PartialType(CreateCategory) {}
