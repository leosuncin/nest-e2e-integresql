import { PickType } from '@nestjs/mapped-types';

import { CreateStock } from '~bikeshop/create-stock.dto';

export class UpdateStock extends PickType(CreateStock, ['quantity']) {}
