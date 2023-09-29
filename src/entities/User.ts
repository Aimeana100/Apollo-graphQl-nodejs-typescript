import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
import { Product } from "./Product";
  
  @Entity()
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: false })
    username: string;
    
    @Column({unique: false})
    email: string;
    
    @Column()
    password: string;

    @OneToMany(() => Product, (product)=> product.creator)
    products: Product[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  