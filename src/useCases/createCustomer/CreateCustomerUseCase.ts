import { ICustomerRepository } from "../../repositories/ICustomerRepository";
import { ICreateCustomerUseCase } from "./ICreateCustomerUseCase";
import { IEmailValidator } from "../protocols/IEmailValidator";
import { IEncrypter } from "../protocols/IEncrypter";

class CreateCustomerUseCase implements ICreateCustomerUseCase {
    constructor(
        private readonly emailValidator: IEmailValidator,
        private readonly customerRepository: ICustomerRepository,
        private readonly encrypter: IEncrypter,
    ) {}
    async execute(data: any): Promise<void> {
        const { name, email, password } = data;

        if (!name || !email || !password) {
            throw new Error("Name, email or password is missing.");
        }

        if (
            typeof name != "string" ||
            typeof email != "string" ||
            typeof password != "string"
        ) {
            throw new Error("Name, email or password must be a string.");
        }

        if (password.length < 8 || password.length > 255) {
            throw new Error(
                "The length of the password must be between 8 and 255.",
            );
        }

        if (!this.emailValidator.isEmail(email)) {
            throw new Error("Email is not valid.");
        }

        const customerExists = await this.customerRepository.findByEmail(email);

        if (customerExists) {
            throw new Error("The customer already exists");
        }

        const customer = {
            name,
            email,
            password: await this.encrypter.hash(password),
        };

        await this.customerRepository.add(customer);

        return;
    }
}

export { CreateCustomerUseCase };
