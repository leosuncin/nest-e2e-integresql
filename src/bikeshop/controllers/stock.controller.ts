import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';

import { CreateStock } from '~bikeshop/create-stock.dto';
import { StockService } from '~bikeshop/stock.service';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body(ValidationPipe) newStock: CreateStock) {
    return this.stockService.create(newStock);
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }
}
