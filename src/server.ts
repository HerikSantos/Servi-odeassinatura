import express from "express";
import { AppDataSource } from "./database";
import { env } from "./env";

const app = express();

AppDataSource.initialize()
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`The server listen on port ${env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database error", err);
    });

export { app };
