import express from "express"
import { viewController } from "./view.controller.js";

const app=express.Router();

const  viewC=new viewController();

app.get("/",(req,res,next)=>{viewC.home(req,res,next)});
app.get("/login",(req,res,next)=>{viewC.login(req,res,next)});
app.get("/signup",(req,res,next)=>{viewC.signup(req,res,next)});

export default app;