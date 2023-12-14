import { customError } from "../middlewares/error.middleware.js";

export class viewController{
    home=async (req,res,next)=>{
        try{
            await res.render("home",{title:"Home",javascript:null});
        }
        catch(err){
            next(err);
        }
    }
    login=async (req,res,next)=>{
        try{
           await res.render("login",{title:"Login",javascript:`<script type="text/javascript" src="./javascript/login.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
    signup=async (req,res,next)=>{
        try{
            await res.render("signup",{title:"Sign",javascript:`<script type="text/javascript" src="./javascript/signup.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
    forgotPassword=async (req,res,next)=>{
        try{
            next(err);
        }
        catch(err){
            next(err);
        }
    }
    termsAndCondition=async (req,res,next)=>{
        try{
            await res.render("termsAndConditions",{title:"Terms and condition",javascript:null});
        }
        catch(err){
            next(err);
        }
    }
    MyaccountView=async (req,res,next)=>{
        try{
            await res.render("myAccountView",{title:"Home",javascript:`<script type="text/javascript" src="./javascript/myAccountView.js" ></script>`,name:req.userData.name});
        }
        catch(err){
            next(err);
        }
    }
}