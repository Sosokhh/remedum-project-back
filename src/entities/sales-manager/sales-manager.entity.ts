import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DateAudit } from "../DateAudit.class";
import { OrderEntity } from "../order/order.entity";


@Entity({ name: 'sales_managers' })
export class SalesManagerEntity extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column()
  username: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({name: "last_name" })
  lastName: string;

  @Column()
  password: string;

  @OneToMany(() => OrderEntity, order => order.sales_manager)
  orders: OrderEntity[];
}
