import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DateAudit } from "../DateAudit.class";

@Entity({ name: 'products' })
export class ProductEntity extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

}
