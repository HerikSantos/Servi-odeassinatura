import { IEncrypter } from "../protocols/IEncrypter";
import { hash, genSalt, compare } from "bcryptjs";

class Encrypter implements IEncrypter {
    async hash(password: string): Promise<string> {
        const salt = await genSalt();

        return hash(password, salt);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await compare(password, hashedPassword);
    }
}

export { Encrypter };
