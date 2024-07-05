import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { Product } from '~bikeshop/product.entity';
import { Store } from '~bikeshop/store.entity';

@Entity('stocks')
export class Stock {
  @ManyToOne(() => Product, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  @PrimaryColumn({ name: 'product_id', type: 'bigint' })
  product!: Product;

  @RelationId((stock: Stock) => stock.product)
  productId!: bigint;

  @ManyToOne(() => Store, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  @PrimaryColumn({ name: 'store_id', type: 'bigint' })
  store!: Store;

  @RelationId((stock: Stock) => stock.store)
  storeId!: bigint;

  @Column({ type: 'integer', default: 0 })
  @Check('"quantity" >= 0')
  quantity!: number;
}
