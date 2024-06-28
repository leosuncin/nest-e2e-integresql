import { PartialType } from '@nestjs/mapped-types';

import { CreateCustomer } from '~bikeshop/create-customer.dto';

export class UpdateCustomer extends PartialType(CreateCustomer) {}
