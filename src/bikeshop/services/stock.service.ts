import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateStock } from '~bikeshop/create-stock.dto';
import { Stock } from '~bikeshop/stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  create(newStock: CreateStock) {
    const stock = this.stockRepository.create(newStock);

    return this.stockRepository.save(stock);
  }
}
