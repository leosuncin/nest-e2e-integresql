import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { Category } from '~bikeshop/category.entity';
import { CreateCategory } from '~bikeshop/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(newCategory: CreateCategory) {
    const category = this.categoryRepository.create(newCategory);

    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }
}
