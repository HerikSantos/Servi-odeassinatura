interface IEncrypter {
    hash: (password: string) => Promise<string>;
}

export { IEncrypter };
