import express from "express";
import user from "./src/feature/users/user.router.js";
import otp from "./src/feature/otp/otp.router.js";
import rolesAndRequest from "./src/feature/rolesAndRequest/rolesAndRequest.router.js";
import company from "./src/feature/company/company.router.js";
import requestTouser from "./src/feature/requestToUser/requestToUser.router.js";
import comment from "./src/feature/comment/comment.router.js";

const app=express.Router();

app.use("/user",user);
app.use("/otp",otp);
app.use("/rolesAndRequest",rolesAndRequest);
app.use("/company",company);
app.use("/requestTouser",requestTouser);
app.use("/comment",comment);

export default app;