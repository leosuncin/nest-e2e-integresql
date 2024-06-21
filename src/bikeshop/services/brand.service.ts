import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { Brand } from '~bikeshop/brand.entity';
import { CreateBrand } from '~bikeshop/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  create(newBrand: CreateBrand) {
    const brand = this.brandRepository.create(newBrand);

    return this.brandRepository.save(brand);
  }
}
