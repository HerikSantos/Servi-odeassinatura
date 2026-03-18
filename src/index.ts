import express from "express";
import { app } from "./server";
import { customerRoute } from "./routes/customerRoute/customerRoute";

app.use(express.json());
app.use(customerRoute);
