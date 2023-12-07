import express from "express"
import { userController } from "./user.controller.js";

const app=express.Router();
const userC=new userController();

app.post("/a",(req,res,next)=>{userC.addNewRole(req,res,next)});
app.post("/sigin",(req,res,next)=>{userC.addNewUser(req,res,next)});
app.post("/login",(req,res,next)=>{userC.login(req,res,next)});

export default app;