import express from "express"
import { viewController } from "./view.controller.js";
import {authorization} from "../middlewares/authorizer.middleware.js"

const app=express.Router();

const  viewC=new viewController();

app.get("/",(req,res,next)=>{
    req["goNext"]="goNext";
    authorization(req,res,next);
}
,(req,res,next)=>{
    if(req.userData){
        res.redirect("/v");
    }else{
        viewC.home(req,res,next)
    }
});

// app.use("/v/a/:rolesId",express.static("public"));

app.get("/login",(req,res,next)=>{viewC.login(req,res,next)});
app.get("/signup",(req,res,next)=>{viewC.signup(req,res,next)});
app.get("/forgot-password",(req,res,next)=>{viewC.forgotPassword(req,res,next)});
app.get("/terms-and-conditions",(req,res,next)=>{viewC.termsAndCondition(req,res,next)});

app.get("/v",authorization,(req,res,next)=>{viewC.MyaccountView(req,res,next)});
app.get("/v/a/:roleId/:companyId/about",(req,res,next)=>{viewC.adminViewAbout(req,res,next);});
app.get("/v/a/:roleId",authorization,(req,res,next)=>{viewC.adminViewHome(req,res,next)});

app.use((req,res,next)=>{res.render("404",{javascript:null,title:"Page not found"})});

export default app;