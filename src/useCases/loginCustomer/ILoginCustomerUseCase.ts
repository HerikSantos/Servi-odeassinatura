interface ILoginCustomerUseCase {
    execute: (data: any) => Promise<ReturnToken>;
}

type ReturnToken = {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

export { ILoginCustomerUseCase, ReturnToken };
