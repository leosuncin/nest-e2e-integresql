import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Brand } from '~bikeshop/brand.entity';
import { Category } from '~bikeshop/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id!: bigint;

  @Column()
  name!: string;

  @Column({ type: 'integer', unsigned: true, name: 'model_year' })
  @Check('"model_year" >= 1970')
  modelYear!: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    name: 'list_price',
    transformer: {
      from: (value: string) => Number.parseFloat(value),
      to: (value: number) => value,
    },
  })
  @Check('"list_price" > 0')
  listPrice!: number;

  @ManyToOne(() => Brand, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand;

  @RelationId((product: Product) => product.brand)
  brandId!: bigint;

  @ManyToOne(() => Category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @RelationId((product: Product) => product.category)
  categoryId!: bigint;
}
