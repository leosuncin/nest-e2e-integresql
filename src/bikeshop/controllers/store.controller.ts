import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { CreateStore } from '~bikeshop/create-store.dto';
import { StoreService } from '~bikeshop/store.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body(ValidationPipe) newStore: CreateStore) {
    return this.storeService.create(newStore);
  }
}
