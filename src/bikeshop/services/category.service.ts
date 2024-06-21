import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { Category } from '~bikeshop/category.entity';
import { CreateCategory } from '~bikeshop/create-category.dto';
import { UpdateCategory } from '~bikeshop/update-category.dto';

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

  findOne(id: bigint) {
    return this.categoryRepository.findOneByOrFail({ id });
  }

  update(category: Category, categoryChanges: UpdateCategory) {
    this.categoryRepository.merge(category, categoryChanges);

    return this.categoryRepository.save(category);
  }

  remove(category: Category) {
    return this.categoryRepository.remove(category);
  }
}
