import { config } from "dotenv";
import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),

    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
});

export const env = envSchema.parse(process.env);
