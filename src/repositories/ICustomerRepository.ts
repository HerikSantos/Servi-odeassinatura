import { Customer } from "../database/entities/Customer";

interface ICustomerRepository {
    add: (customer: Customer) => Promise<void>;
    findByEmail: (email: string) => Promise<Customer | null>;
}

export { ICustomerRepository };
