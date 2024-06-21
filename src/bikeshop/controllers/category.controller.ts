import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';

import { CategoryService } from '~bikeshop/category.service';
import { CreateCategory } from '~bikeshop/create-category.dto';

@Controller('categorys')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body(ValidationPipe) newCategory: CreateCategory) {
    return this.categoryService.create(newCategory);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
