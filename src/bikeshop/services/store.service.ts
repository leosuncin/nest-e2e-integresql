import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateStore } from '~bikeshop/create-store.dto';
import { Store } from '~bikeshop/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  create(newStore: CreateStore) {
    const store = this.storeRepository.create(newStore);

    return this.storeRepository.save(store);
  }

  findAll() {
    return this.storeRepository.find();
  }

  findOne(id: bigint) {
    return this.storeRepository.findOneByOrFail({ id });
  }
}
