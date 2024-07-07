import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { CreateStock } from '~bikeshop/create-stock.dto';
import { StockService } from '~bikeshop/stock.service';
import { UpdateStock } from '~bikeshop/update-stock.dto';
import { EntityDuplicatedFilter } from '~common/entity-duplicated.filter';
import { EntityNotFoundFilter } from '~common/entity-not-found.filter';
import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('stock')
  @UseFilters(EntityDuplicatedFilter)
  create(@Body(ValidationPipe) newStock: CreateStock) {
    return this.stockService.create(newStock);
  }

  @Get('stores/:storeId/stock')
  findAllByStore(@Param('storeId', ParseBigIntPipe) storeId: bigint) {
    return this.stockService.findAllByStore(storeId);
  }

  @Get('products/:productId/stock')
  findAllByProduct(@Param('productId', ParseBigIntPipe) productId: bigint) {
    return this.stockService.findAllByProduct(productId);
  }

  @Get('stock')
  @UseFilters(EntityNotFoundFilter)
  async findOne(
    @Query('product', ParseBigIntPipe) productId: bigint,
    @Query('store', ParseBigIntPipe) storeId: bigint,
  ) {
    return this.stockService.findOne(productId, storeId);
  }

  @Patch('stock')
  @UseFilters(EntityNotFoundFilter)
  async update(
    @Query('product', ParseBigIntPipe) productId: bigint,
    @Query('store', ParseBigIntPipe) storeId: bigint,
    @Body(ValidationPipe) changeStock: UpdateStock,
  ) {
    return this.stockService.update(productId, storeId, changeStock);
  }
}
