import { IEncrypter } from "../protocols/IEncrypter";
import { hash, genSalt } from "bcryptjs";

class Encrypter implements IEncrypter {
    async hash(password: string): Promise<string> {
        const salt = await genSalt();
        return hash(password, salt);
    }
}

export { Encrypter };
