import { Repository } from "typeorm";
import { ICustomerRepository } from "./ICustomerRepository";
import { CreateCustomer, Customer } from "../database/entities/Customer";
import { AppDataSource } from "../database";

class CustomerRepository implements ICustomerRepository {
    private readonly repository: Repository<Customer>;

    constructor() {
        this.repository = AppDataSource.getRepository(Customer);
    }

    async add(customer: CreateCustomer): Promise<void> {
        const createdCustomer = this.repository.create(customer);

        await this.repository.save(createdCustomer);
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const customer = await this.repository.findOneBy({ email });

        return customer;
    }
}

export { CustomerRepository };
