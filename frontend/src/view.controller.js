import { customError } from "../middlewares/error.middleware.js";

export class viewController{
    home=async (req,res,next)=>{
        try{
            await res.render("home",{title:"home",javascript:null});
        }
        catch(err){
            throw new customError(400,"something went wromng whille loading the home page");
        }
    }
    login=async (req,res,next)=>{
        try{
           await res.render("login",{title:"login",javascript:`<script type="text/javascript" src="./javascript/login.js" ></script>`});
        }
        catch(err){
            throw new customError(400,"something went wrong while rendering the login page");
        }
    }
    signup=async (req,res,next)=>{
        try{
            await res.render("signup",{title:"sign",javascript:`<script type="text/javascript" src="./javascript/signup.js" ></script>`});
        }
        catch(err){
            throw new customError(400,"something went wrong while rendering the sigin page");
        }
    }
    forgotPassword=async (req,res,next)=>{
        try{
            await res.render("forgotPassword",{title:"forgot password",javascript:`<script type="text/javascript" src="./javascript/forgotPassword.js" ></script>`});
        }
        catch(err){
            throw new customError(400,"something went wrong while rendering the forgot-password page");
        }
    }
    termsAndCondition=async (req,res,next)=>{
        try{
            await res.render("termsAndConditions",{title:"terms and condition",javascript:null});
        }
        catch(err){
            throw new customError(400,"something went wrong while rendering the terms and condition");
        }
    }
}