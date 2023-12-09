import express from "express";
import user from "./src/feature/users/user.router.js";

const app=express.Router();

app.use("/user",user);

export default app;