import { PartialType } from '@nestjs/mapped-types';

import { CreateStore } from '~bikeshop/create-store.dto';

export class UpdateStore extends PartialType(CreateStore) {}
