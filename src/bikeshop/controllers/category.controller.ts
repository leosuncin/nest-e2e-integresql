import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { CastCategoryPipe } from '~bikeshop/cast-category.pipe';
import { Category } from '~bikeshop/category.entity';
import { CategoryService } from '~bikeshop/category.service';
import { CreateCategory } from '~bikeshop/create-category.dto';
import { UpdateCategory } from '~bikeshop/update-category.dto';
import { EntityNotFoundFilter } from '~common/entity-not-found.filter';
import { ParseBigIntPipe } from '~common/parse-big-int.pipe';

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

  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseFilters(EntityNotFoundFilter)
  update(
    @Param('id', ParseBigIntPipe, CastCategoryPipe) category: Category,
    @Body(ValidationPipe) categoryChanges: UpdateCategory,
  ) {
    return this.categoryService.update(category, categoryChanges);
  }
}
