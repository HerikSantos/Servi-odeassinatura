import { ICustomerRepository } from "../../repositories/ICustomerRepository";
import {
    IAutheticationToken,
    TokenPayLoad,
} from "../protocols/IAutheticationToken";
import { IEmailValidator } from "../protocols/IEmailValidator";
import { IEncrypter } from "../protocols/IEncrypter";
import { ILoginCustomerUseCase, ReturnToken } from "./ILoginCustomerUseCase";

class LoginCustomerUseCase implements ILoginCustomerUseCase {
    constructor(
        private readonly emailValidator: IEmailValidator,
        private readonly customerRepository: ICustomerRepository,
        private readonly autheticationToken: IAutheticationToken,
        private readonly encrypter: IEncrypter,
    ) {}

    async execute(data: any): Promise<ReturnToken> {
        const { email, password } = data;

        if (!email || !password) {
            throw new Error("Email or password is missing.");
        }

        if (typeof email != "string" || typeof password != "string") {
            throw new Error("Email or password is incorrect.");
        }

        if (!this.emailValidator.isEmail(email)) {
            throw new Error("Email or password is incorrect.");
        }

        const customer = await this.customerRepository.findByEmail(email);

        if (!customer) {
            throw new Error("Email or password is incorrect.");
        }

        const { password: hashedPassword, id, name } = customer;

        const compareResult = this.encrypter.compare(password, hashedPassword);

        if (!compareResult) {
            throw new Error("Email or password is incorrect.");
        }

        const payLoad: TokenPayLoad = {
            sub: id,
            email,
        };

        const token = this.autheticationToken.token(payLoad);

        return {
            token,
            user: {
                id,
                name,
                email,
            },
        };
    }
}

export { LoginCustomerUseCase };
