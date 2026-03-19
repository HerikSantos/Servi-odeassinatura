interface ILoginCustomerUseCase {
    execute: (data: any) => Promise<AcessToken>;
}

type AcessToken = {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

export { ILoginCustomerUseCase, AcessToken };
