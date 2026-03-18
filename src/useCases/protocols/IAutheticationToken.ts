type TokenPayLoad = {
    sub: number;
    email: string;
    role?: string;
};

interface IAutheticationToken {
    token: (payload: string | TokenPayLoad) => string;
}

export { IAutheticationToken, TokenPayLoad };
