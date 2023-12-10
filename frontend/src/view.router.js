import express from "express"
import { viewController } from "./view.controller.js";

const app=express.Router();

const  viewC=new viewController();

app.get("/",(req,res,next)=>{viewC.home(req,res,next)});
app.get("/login",(req,res,next)=>{viewC.login(req,res,next)});
app.get("/signup",(req,res,next)=>{viewC.signup(req,res,next)});
app.get("/forgot-password",(req,res,next)=>{viewC.forgotPassword(req,res,next)});
app.get("/terms-and-conditions",(req,res,next)=>{viewC.termsAndCondition(req,res,next)});

app.use((req,res,next)=>{res.render("404",{javascript:null,title:"Page not found"})});

export default app;