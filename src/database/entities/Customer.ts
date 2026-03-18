import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;
}

type CreateCustomer = {
    name: string;
    email: string;
    password: string;
};

export { Customer, CreateCustomer };
