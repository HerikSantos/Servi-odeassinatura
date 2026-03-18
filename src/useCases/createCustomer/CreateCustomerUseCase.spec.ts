import { ICreateCustomerUseCase } from "./ICreateCustomerUseCase";
import { CreateCustomerUseCase } from "./CreateCustomerUseCase";
import { IEmailValidator } from "../protocols/IEmailValidator";
import { ICustomerRepository } from "../../repositories/ICustomerRepository";
import { CreateCustomer, Customer } from "../../database/entities/Customer";
import { IEncrypter } from "../protocols/IEncrypter";

interface ITypeSUT {
    sut: ICreateCustomerUseCase;
    emailValidatorStub: IEmailValidator;
    customerRepositoryStub: ICustomerRepository;
    encrypterStub: IEncrypter;
}

function makeEncrypterStub(): IEncrypter {
    class EncrypterStub implements IEncrypter {
        async hash(password: string): Promise<string> {
            return "hashedPassword";
        }
        compare: (password: string, hashedPassword: string) => Promise<boolean>;
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

let repository: Customer[] = [];

function makeCustomerRepositoryStub(): ICustomerRepository {
    class CustomerRepositoryStub implements ICustomerRepository {
        async findByEmail(email: string): Promise<Customer | null> {
            const customer = repository.find(
                (customer) => customer.email == email,
            );
            if (!customer) {
                return null;
            }
            return customer;
        }
        async add(customer: CreateCustomer): Promise<void> {
            const customerWithID = { ...customer, id: 1 };
            repository.push(customerWithID);
        }
    }

    return new CustomerRepositoryStub();
}

function makeSUT(): ITypeSUT {
    const encrypterStub = makeEncrypterStub();
    const customerRepositoryStub = makeCustomerRepositoryStub();
    const emailValidatorStub = makeEmailValidatorStub();
    const sut = new CreateCustomerUseCase(
        emailValidatorStub,
        customerRepositoryStub,
        encrypterStub,
    );

    return { sut, emailValidatorStub, customerRepositoryStub, encrypterStub };
}

describe("Create customer", () => {
    beforeEach(() => {
        repository = [];
    });
    it("Should throw if the name is invalid", async () => {
        const customer = {
            name: "",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Name, email or password is missing."),
        );
    });

    it("Should throw if the email is invalid", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "",
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Name, email or password is missing."),
        );
    });

    it("Should throw if the password is invalid", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Name, email or password is missing."),
        );
    });

    it("Should throw if the name isn't string", async () => {
        const customer = {
            name: 123,
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Name, email or password must be a string."),
        );
    });

    it("Should throw if the email isn't string", async () => {
        const customer = {
            name: "Teste da Silva",
            email: 123,
            password: "password123",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Name, email or password must be a string."),
        );
    });

    it("Should throw if the password isn't string", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: 12345678,
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Name, email or password must be a string."),
        );
    });

    it("Should throw if password length is less than 8", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "passwor",
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("The length of the password must be between 8 and 255."),
        );
    });

    it("Should throw if password length is greater than 255", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "a".repeat(256),
        };

        const { sut } = makeSUT();

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("The length of the password must be between 8 and 255."),
        );
    });

    it("Should throw if email is not valid", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { emailValidatorStub, sut } = makeSUT();

        const emailValidatorStubSpy = jest.spyOn(emailValidatorStub, "isEmail");
        emailValidatorStubSpy.mockReturnValueOnce(false);

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email is not valid."),
        );
    });

    it("EmailValidator should be called with email", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { emailValidatorStub, sut } = makeSUT();

        const emailValidatorStubSpy = jest.spyOn(emailValidatorStub, "isEmail");

        sut.execute(customer);

        expect(emailValidatorStubSpy).toHaveBeenCalledWith(customer.email);
    });

    it("EmailValidator should throw if email is not valid ", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "testegmail.com",
            password: "password123",
        };

        const { emailValidatorStub, sut } = makeSUT();

        jest.spyOn(emailValidatorStub, "isEmail").mockReturnValueOnce(false);

        expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("Email is not valid."),
        );
    });

    it("Should throw if the customer alrealdy exists", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut } = makeSUT();

        await sut.execute(customer);

        await expect(sut.execute(customer)).rejects.toStrictEqual(
            new Error("The customer already exists"),
        );
    });

    it("Encrypter should be called with password", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { sut, encrypterStub } = makeSUT();

        const encrypterStubSpy = jest.spyOn(encrypterStub, "hash");

        await sut.execute(customer);

        expect(encrypterStubSpy).toHaveBeenCalledWith(customer.password);
    });

    it("Should create a customer with hashed password", async () => {
        const customer = {
            name: "Teste da Silva",
            email: "teste@gmail.com",
            password: "password123",
        };

        const { customerRepositoryStub, sut } = makeSUT();

        const customerRepositoryStubSpy = jest.spyOn(
            customerRepositoryStub,
            "add",
        );

        await sut.execute(customer);

        expect(customerRepositoryStubSpy).toHaveBeenCalledWith(
            expect.objectContaining({ password: "hashedPassword" }),
        );
    });
});
