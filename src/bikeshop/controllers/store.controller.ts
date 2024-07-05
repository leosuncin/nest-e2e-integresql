import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { CastStorePipe } from '~bikeshop/cast-store.pipe';
import { CreateStore } from '~bikeshop/create-store.dto';
import { Store } from '~bikeshop/store.entity';
import { StoreService } from '~bikeshop/store.service';
import { UpdateStore } from '~bikeshop/update-store.dto';
import { EntityNotFoundFilter } from '~common/entity-not-found.filter';
import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body(ValidationPipe) newStore: CreateStore) {
    return this.storeService.create(newStore);
  }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @UseFilters(EntityNotFoundFilter)
  update(
    @Param('id', ParseBigIntPipe, CastStorePipe) store: Store,
    @Body(ValidationPipe) storeChanges: UpdateStore,
  ) {
    return this.storeService.update(store, storeChanges);
  }
}
