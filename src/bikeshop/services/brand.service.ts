import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { Brand } from '~bikeshop/brand.entity';
import { CreateBrand } from '~bikeshop/create-brand.dto';
import { UpdateBrand } from '~bikeshop/update-brand.dto';

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

  findAll() {
    return this.brandRepository.find();
  }

  findOne(id: bigint) {
    return this.brandRepository.findOneByOrFail({ id });
  }

  update(brand: Brand, brandChanges: UpdateBrand) {
    this.brandRepository.merge(brand, brandChanges);

    return this.brandRepository.save(brand);
  }

  remove(brand: Brand) {
    return this.brandRepository.remove(brand);
  }
}
