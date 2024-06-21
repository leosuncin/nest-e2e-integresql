import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id!: bigint;

  @Column()
  name!: string;
}
