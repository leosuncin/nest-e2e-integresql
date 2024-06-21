import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id!: bigint;

  @Column()
  name!: string;
}
