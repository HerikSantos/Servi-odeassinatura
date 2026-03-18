interface IEncrypter {
    hash: (password: string) => Promise<string>;
    compare: (password: string, hashedPassword: string) => Promise<boolean>;
}

export { IEncrypter };
