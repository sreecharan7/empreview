import { requestToBackend } from "./requsetToBackend.repository.js";

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;  
    return objectIdPattern.test(id);
};

export class viewController{
    constructor(){
        this.requestToBackend=new requestToBackend();
    }

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
            await res.render("forgotPassword",{title:"forgot password",javascript:`<script type="text/javascript" src="./javascript/forgotPassword.js" ></script>`});
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
    adminViewHome=async (req,res,next)=>{
        try{
            if(!isValidObjectId(req.params.roleId)){
                res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            let role=await this.requestToBackend.checkTheCompanyToUserIdToAdmin(req.userData.userId,req.params.roleId);
            if(role){
                await res.render("adminViewHome",{title:"Company",javascript:null,companyName:role.companyName,companyId:role.companyId,roleId:role._id});
            }
            else{
                res.redirect("/404");
            }
        }
        catch(err){
            next(err);
        }
    }
    adminViewAbout=async(req,res,next)=>{
        try{
            if(!isValidObjectId(req.params.roleId)&&!isValidObjectId(req.params.companyId)){
                res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            res.render("adminViewAbout",{title:"About company",javascript:null});
        }
        catch(err){
            next(err);
        }

    }
}