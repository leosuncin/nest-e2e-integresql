import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateProduct } from '~bikeshop/create-product.dto';
import { Product } from '~bikeshop/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(newProduct: CreateProduct) {
    const product = this.productRepository.create(newProduct);

    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }
}
