import { CreateCustomer, Customer } from "../database/entities/Customer";

interface ICustomerRepository {
    add: (customer: CreateCustomer) => Promise<void>;
    findByEmail: (email: string) => Promise<Customer | null>;
}

export { ICustomerRepository };
