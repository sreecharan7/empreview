import express from "express";
import user from "./src/feature/users/user.router.js";
import otp from "./src/feature/otp/otp.router.js";
import rolesAndRequest from "./src/feature/rolesAndRequest/rolesAndRequest.router.js";
import company from "./src/feature/admin/company.router.js";
const app=express.Router();

app.use("/user",user);
app.use("/otp",otp);
app.use("/rolesAndRequest",rolesAndRequest);
app.use("/company",company);

export default app;