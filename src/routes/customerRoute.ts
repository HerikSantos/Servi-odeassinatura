import { Request, Response, Router } from "express";
import { CreateCustomerController } from "../useCases/createCustomer/CreateCustomerController";
import { CreateCustomerUseCase } from "../useCases/createCustomer/CreateCustomerUseCase";
import { EmailValidator } from "../useCases/adapter/EmailValidator";
import { Encrypter } from "../useCases/adapter/Encrypter";
import { CustomerRepository } from "../repositories/CustomerRepository";

const customerRoute = Router();

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

customerRoute.post("/create", async (request: Request, response: Response) => {
    await createCustomerController.handle(request, response);
});

export { customerRoute };
