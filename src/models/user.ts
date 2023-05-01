import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: "https://cdn.onlinewebfonts.com/svg/img_264570.png"})
    profile_img: string

    @Column({ default: 0 })
    permission: number

    @Column({ default: 0 })
    balance: number

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    // Cart
    @OneToMany(() => Cart_Product, cart_product => cart_product.user)
    cart: Cart_Product[]
}

@Entity()
export class Cart_Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @ManyToMany(() => Product)
    @JoinTable()
    product: Product[]

    @ManyToOne(() => User)
    @JoinTable()
    user?: User

    @ManyToOne(() => Order)
    @JoinTable()
    order?: Order
}


@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    // Date
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    date: Date

    // Cart
    @OneToMany(() => Cart_Product, cart_product => cart_product.order)
    order: Cart_Product[]

    @Column()
    total: number

    @ManyToOne(() => User)
    @JoinTable()
    user: User
}

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    img: string

    @Column()
    description: string

    @Column()
    price: number

    @ManyToOne(() => Order)
    orders: Order[]
}
