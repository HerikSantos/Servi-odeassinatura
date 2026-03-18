import { CreateCustomerController } from "../../useCases/createCustomer/CreateCustomerController";
import { CreateCustomerUseCase } from "../../useCases/createCustomer/CreateCustomerUseCase";
import { EmailValidator } from "../../useCases/adapter/EmailValidator";
import { Encrypter } from "../../useCases/adapter/Encrypter";
import { CustomerRepository } from "../../repositories/CustomerRepository";
import { LoginCustomerController } from "../../useCases/loginCustomer/LoginCustomerController";
import { LoginCustomerUseCase } from "../../useCases/loginCustomer/LoginCustomerUseCase";
import { AutheticationToken } from "../../useCases/adapter/AutheticationToken";
import { env } from "../../env";

const autheticationToken = new AutheticationToken(env.SECRET);
const customerRepository = new CustomerRepository();
const encrypter = new Encrypter();
const emailValidator = new EmailValidator();
const createCustomerUseCase = new CreateCustomerUseCase(
    emailValidator,
    customerRepository,
    encrypter,
);
const createCustomerController = new CreateCustomerController(
    createCustomerUseCase,
);

const loginCustomerUseCase = new LoginCustomerUseCase(
    emailValidator,
    customerRepository,
    autheticationToken,
    encrypter,
);

const loginCustomerController = new LoginCustomerController(
    loginCustomerUseCase,
);

export { createCustomerController, loginCustomerController };
