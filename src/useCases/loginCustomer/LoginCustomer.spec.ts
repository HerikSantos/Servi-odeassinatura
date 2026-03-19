import { ILoginCustomerUseCase, AcessToken } from "./ILoginCustomerUseCase";
import { LoginCustomerUseCase } from "./LoginCustomerUseCase";
import { IEmailValidator } from "../protocols/IEmailValidator";
import { ICustomerRepository } from "../../repositories/ICustomerRepository";
import { CreateCustomer, Customer } from "../../database/entities/Customer";
import { IEncrypter } from "../protocols/IEncrypter";
import {
    IAutheticationToken,
    TokenPayLoad,
} from "../protocols/IAutheticationToken";

interface ITypeSUT {
    sut: ILoginCustomerUseCase;
    emailValidatorStub: IEmailValidator;
    customerRepositoryStub: ICustomerRepository;
    encrypterStub: IEncrypter;
    autheticationTokenStub: IAutheticationToken;
}

function makeAutheticationToken(): IAutheticationToken {
    class AutheticationTokenStub implements IAutheticationToken {
        token(payload: string | TokenPayLoad): string {
            return "token";
        }
    }

    return new AutheticationTokenStub();
}

function makeEncrypterStub(): IEncrypter {
    class EncrypterStub implements IEncrypter {
        async hash(password: string): Promise<string> {
            return "hashedPassword";
        }
        async compare(
            password: string,
            hashedPassword: string,
        ): Promise<boolean> {
            return true;
        }
    }

    return new EncrypterStub();
}

function makeEmailValidatorStub(): IEmailValidator {
    class EmailValidatorStub implements IEmailValidator {
        isEmail(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
}

function makeCustomerRepositoryStub(): ICustomerRepository {
    class CustomerRepositoryStub implements ICustomerRepository {
        async findByEmail(email: string): Promise<Customer | null> {
            return {
                id: 1,
                name: "Teste da Silva",
                email: "teste@gmail.com",
                password: "hashedPassword",
            };
        }
        async add(customer: CreateCustomer): Promise<void> {}
    }

    return new CustomerRepositoryStub();
}

function makeSUT(): ITypeSUT {
    const encrypterStub = makeEncrypterStub();
    const customerRepositoryStub = makeCustomerRepositoryStub();
    const emailValidatorStub = makeEmailValidatorStub();
    const autheticationTokenStub = makeAutheticationToken();
    const sut = new LoginCustomerUseCase(
        emailValidatorStub,
        customerRepositoryStub,
        autheticationTokenStub,
        encrypterStub,
    );

    return {
        sut,
        emailValidatorStub,
        customerRepositoryStub,
        encrypterStub,
        autheticationTokenStub,
    };
}

describe("Login customer", () => {
    it("Should throw if email is missing", async () => {
        const customer = {
            email: "",
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email or password is missing."),
        );
    });

    it("Should throw if password is missing", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email or password is missing."),
        );
    });

    it("Should throw if email is not a string", async () => {
        const customer = {
            email: 123,
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email or password is incorrect."),
        );
    });

    it("Should throw if password is not a string", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: 123,
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email or password is incorrect."),
        );
    });

    it("IsEmail should been called with email.", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, emailValidatorStub } = makeSUT();

        const emailValidatorStubSpy = jest.spyOn(emailValidatorStub, "isEmail");

        sut.execute(customer);

        expect(emailValidatorStubSpy).toHaveBeenCalledWith(customer.email);
    });

    it("Should throw if email is not valid.", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, emailValidatorStub } = makeSUT();

        jest.spyOn(emailValidatorStub, "isEmail").mockReturnValueOnce(false);

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email or password is incorrect."),
        );
    });

    it("FindByEmail should been called with email.", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, customerRepositoryStub } = makeSUT();

        const customerRepositoryStubSpy = jest.spyOn(
            customerRepositoryStub,
            "findByEmail",
        );

        await sut.execute(customer);

        expect(customerRepositoryStubSpy).toHaveBeenCalledWith(customer.email);
    });

    it("Should throw if customer does not exists", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, customerRepositoryStub } = makeSUT();

        jest.spyOn(customerRepositoryStub, "findByEmail").mockResolvedValueOnce(
            null,
        );

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email or password is incorrect."),
        );
    });

    it("Compare should been called with password and hashedPassword", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, encrypterStub } = makeSUT();

        const encrypterStubSpy = jest.spyOn(encrypterStub, "compare");

        await sut.execute(customer);

        expect(encrypterStubSpy).toHaveBeenCalledWith(
            customer.password,
            "hashedPassword",
        );
    });

    it("Should throw if compare password return false", async () => {
        const customer = {
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, encrypterStub } = makeSUT();

        jest.spyOn(encrypterStub, "compare").mockResolvedValueOnce(false);

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email or password is incorrect."),
        );
    });

    it("AutheticationToken should been called with correct payload", async () => {
        const customer = {
            id: 1,
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, autheticationTokenStub } = makeSUT();

        const autheticationTokenStubSpy = jest.spyOn(
            autheticationTokenStub,
            "token",
        );

        await sut.execute(customer);

        expect(autheticationTokenStubSpy).toHaveBeenCalledWith({
            sub: customer.id,
            email: customer.email,
        });
    });

    it("AutheticationToken should return a token", async () => {
        const customer = {
            id: 1,
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, autheticationTokenStub } = makeSUT();

        const autheticationTokenStubSpy = jest.spyOn(
            autheticationTokenStub,
            "token",
        );

        await sut.execute(customer);

        expect(autheticationTokenStubSpy).toHaveReturnedWith("token");
    });

    it("Should return access token on successful authentication", async () => {
        const customer = {
            id: 1,
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut } = makeSUT();

        const result = await sut.execute(customer);

        expect(result).toEqual({
            token: "token",
            user: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
            },
        });
    });
});
