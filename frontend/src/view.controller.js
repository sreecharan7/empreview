import { requestToBackend } from "../middlewares/requsetToBackend.repository.js";
import jwt from "jsonwebtoken";

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
           await res.render("login",{title:"Login",javascript:`<script type="text/javascript" src="/javascript/login.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
    signup=async (req,res,next)=>{
        try{
            await res.render("signup",{title:"Sign",javascript:`<script type="text/javascript" src="/javascript/signup.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
    forgotPassword=async (req,res,next)=>{
        try{
            await res.render("forgotPassword",{title:"forgot password",javascript:`<script type="text/javascript" src="/javascript/forgotPassword.js" ></script>`});
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
            await res.render("myAccountView",{title:"Home",javascript:`<script type="text/javascript" src="/javascript/myAccountView.js" ></script>`,name:req.userData.name});
        }
        catch(err){
            next(err);
        }
    }
    adminViewHome=async (req,res,next)=>{
        try{
            if(!(isValidObjectId(req.query.r)||(req.userData["companyId"]&&(req.userData["role"]=="admin"||req.userData["role"]=="both")))){
                res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            let roleId=req.query.r
            if(!roleId||roleId==req.userData["roleId"]){
                await res.render("adminViewHome",{title:"Company",javascript:null,companyName:req.userData["companyName"],role:req.userData["role"]});
                return;
            }
            let role=await this.requestToBackend.checkTheCompanyToUserIdToAdmin(req.userData.userId,roleId);
            if(role){
                req.userData.cookieData["companyId"]=role.companyId;
                req.userData.cookieData["role"]=role.role;
                req.userData.cookieData["companyName"]=role.companyName;
                req.userData.cookieData["roleId"]=role._id;
                var token=jwt.sign(req.userData.cookieData, process.env.jwt);
                res.cookie(process.env.cookieNameUserCredientails,token,{maxAge: parseInt(process.env.expoireOfCookieUserCredientails)});
                await res.render("adminViewHome",{title:"Company",javascript:null,companyName:role.companyName,role:role.role});
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
            if(!(req.userData["companyId"]&&(req.userData["role"]=="admin"||req.userData["role"]=="both"))){
                await res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            const company=await this.requestToBackend.getCompanyDetails(req.userData["companyId"],req.userData["roleId"]);
            res.render("adminViewAbout",{title:"About company",javascript:`<script type="text/javascript" src="/javascript/adminViewAbout.js" ></script>`,company:company});
        }
        catch(err){
            next(err);
        }

    }
    addEmployee=async (req,res,next)=>{
        try{
            if(!(req.userData["companyId"]&&(req.userData["role"]=="admin"||req.userData["role"]=="both"))){
                await res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            res.render("addEmployee",{title:"add employee",javascript:`<script type="text/javascript" src="/javascript/addEmployee.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
    requestToUserPage=async(req,res,next)=>{
        try{
            const {c}=req.query;
            const {userId}=req.userData;
            const re=await this.requestToBackend.findTheRequest(c,userId);
            if(re.length==0){
                await res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"May be page is expired",sideHeading:"Something went wrong go to home page, may be request is expired",button:"home",link:"/"});
            }
            else{
                await res.render("requestToUserPage",{title:"add employee",javascript:`<script type="text/javascript" src="/javascript/requestToUserPage.js" ></script>`,re});
            }
        }catch(err){
            next(err);
        }
    }
    organisationEmployeePage=async(req,res,next)=>{
        try{
            if(!(req.userData["companyId"]&&(req.userData["role"]=="admin"||req.userData["role"]=="both"))){
                await res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            await res.render("organisationEmployee",{title:"employee view",javascript:`<script type="text/javascript" src="/javascript/organisationEmployee.js"></script>`});
        }catch(err){
            next(err);
        }
    }
    employeeViewHome=async(req,res,next)=>{
        try{
            if(!(isValidObjectId(req.query.r)||(req.userData["companyId"]&&(req.userData["role"]=="employee"||req.userData["role"]=="both")))){
                res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            let roleId=req.query.r;
            if(!roleId){roleId=req.userData["roleId"];}
            let data=await this.requestToBackend.getTheDataOfEmployee(roleId);
            if(data.length==0){
                res.redirect("/404");
                return;
            }
                data=data[0];
                req.userData.cookieData["companyId"]=data.companyId;
                req.userData.cookieData["role"]=data.role;
                req.userData.cookieData["companyName"]=data.companyName;
                req.userData.cookieData["roleId"]=data._id;
                var token=jwt.sign(req.userData.cookieData, process.env.jwt);
                res.cookie(process.env.cookieNameUserCredientails,token,{maxAge: parseInt(process.env.expoireOfCookieUserCredientails)});
                if(data.role=='admin'){
                    res.redirect("/v/a");
                    return;
                }
            // if(data.banner!="lightgrey"){data.banner=`url(${data.banner})`}

            await res.render("employeeHomeView",{title:"employee view",javascript:`<script type="text/javascript" src="/javascript/employeeHomeView.js"></script>`,name:data.name,about:data.about,photo:data.photo,banner:data.banner,rating:data.rating,noOfRating:data.noOfRating});
        }catch(err){
            next(err);
        }
    }
    adminViewSettings=async(req,res,next)=>{
        try{
            if(!(req.userData["companyId"]&&(req.userData["role"]=="admin"||req.userData["role"]=="both"))){
                await res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            await res.render("adminSettingPage",{title:"Setting",javascript:`<script type="text/javascript" src="/javascript/adminSettingPage.js"></script>`});
        }catch(err){
            next(err);
        }
    }
    employeeCommentPage=async(req,res,next)=>{
        try{
            if(!(req.userData["companyId"]&&(req.userData["role"]=="employee"||req.userData["role"]=="both"))){
                await res.render("customMessageShower",{title:"invalid data",javascript:null,heading:"Please check the URL",sideHeading:"Something went wrong go to home page",button:"home",link:"/"});
                return;
            }
            await res.render("employeeCommentPage",{title:"Comment",javascript:`<script type="text/javascript" src="/javascript/employeeCommentPage.js"></script>`,css:"body { font-family: Arial, sans-serif; } .rating { display: inline-block; } .rating input { display: none; } .rating label { cursor: pointer; font-size: 36px; color: #ccc; float: right; } .rating label:before { content: '\\2605'; } .rating input:checked ~ label { color: #ffc107; } .rating label:hover, .rating input:checked ~ label:hover { color: #ffcc00; }"});
        }catch(err){
            next(err);
        }
    }
}