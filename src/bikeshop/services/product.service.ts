import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateProduct } from '~bikeshop/create-product.dto';
import { Product } from '~bikeshop/product.entity';
import { UpdateProduct } from '~bikeshop/update-product.dto';

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

  findOne(id: bigint) {
    return this.productRepository.findOneByOrFail({ id });
  }

  update(product: Product, productChanges: UpdateProduct) {
    this.productRepository.merge(product, productChanges);

    return this.productRepository.save(product);
  }

  remove(product: Product) {
    return this.productRepository.remove(product);
  }
}
