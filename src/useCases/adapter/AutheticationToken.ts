import jwt from "jsonwebtoken";
import {
    IAutheticationToken,
    TokenPayLoad,
} from "../protocols/IAutheticationToken";

class AutheticationToken implements IAutheticationToken {
    constructor(private readonly secret: string) {}

    token(payload: string | TokenPayLoad): string {
        return jwt.sign(payload, this.secret);
    }
}

export { AutheticationToken };
