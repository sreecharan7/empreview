import express from "express";
import user from "./src/feature/users/user.router.js";
import otp from "./src/feature/otp/otp.router.js";

const app=express.Router();

app.use("/user",user);
app.use("/otp",otp);
export default app;