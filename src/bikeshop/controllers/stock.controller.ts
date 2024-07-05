import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { CreateStock } from '~bikeshop/create-stock.dto';
import { StockService } from '~bikeshop/stock.service';
import { EntityNotFoundFilter } from '~common/entity-not-found.filter';
import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('stocks')
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

  @Get('stocks/:productId&:storeId')
  @UseFilters(EntityNotFoundFilter)
  async findOne(
    @Param('productId', ParseBigIntPipe) productId: bigint,
    @Param('storeId', ParseBigIntPipe) storeId: bigint,
  ) {
    return this.stockService.findOne(productId, storeId);
  }
}
