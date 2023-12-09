import express from "express"
import { userController } from "./user.controller.js";
import upload from "../../middlewares/fileupload.middleware.js";

const app=express.Router();
const userC=new userController();

app.post("/a",(req,res,next)=>{userC.addNewRole(req,res,next)});
app.post("/sigin",upload.fields([{name:"photo",maxCount:1},{name:"banner",maxCount:1}]),(req,res,next)=>{userC.addNewUser(req,res,next)});
app.post("/login",(req,res,next)=>{userC.login(req,res,next)});

export default app;