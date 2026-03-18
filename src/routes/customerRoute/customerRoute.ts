import { Request, Response, Router } from "express";
import { createCustomerController, loginCustomerController } from "./index";

const customerRoute = Router();

customerRoute.post("/create", async (request: Request, response: Response) => {
    await createCustomerController.handle(request, response);
});

customerRoute.post("/login", async (request: Request, response: Response) => {
    await loginCustomerController.handle(request, response);
});

export { customerRoute };
