import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SalesManagerEntity } from "../sales-manager/sales-manager.entity";
import { DateAudit } from "../DateAudit.class";
import { ProductEntity } from "../product/product.entity";

@Entity('orders')
export class OrderEntity extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'quantity'})
  quantity: number;

  @Column({name: 'total_price'})
  total_price: number;

  @ManyToOne(() => SalesManagerEntity, salesManager => salesManager.orders)
  @JoinColumn({ name: 'sales_manager_id' })
  sales_manager: SalesManagerEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({name: 'sales_manager_id'})
  salesManagerId: number;
}