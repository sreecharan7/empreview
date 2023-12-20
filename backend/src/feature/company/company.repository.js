import mongoose from "mongoose";
import { companyschema } from "./company.schema.js";
import { customError } from "../../middlewares/error.middleware.js";

const companyModel=mongoose.model("company",companyschema);


export class companyRepository{
    add=async (companyName,userId,about)=>{
        try{
            const newCompany=companyModel.create({companyName,userId,about});
            // await newCompany.save();
            return await newCompany;
        }
        catch(err){
            throw new customError(400,"organisation name is is aldready exist with your account");
        }
    }
    getCompanyByShortComapyId=async (shortCompanyId)=>{
        try{
            const company=await companyModel.findOne({shortCompanyId},{noOfEmployee:0,admin:0});
            return company;
        }
        catch(err){
            throw new customError(400,"something went wrong will creating the account, please tryagain");
        }
    }
    addOrRemoveEmployee=async(companyId,employeeNumber,method)=>{
        try{
            let company=await companyModel.findById(companyId);
            if(!company){throw new customError(400,"company is not found");}
            if(method==="+"){
                company.noOfEmployee+=employeeNumber;
            }
            else if(method==="-"){
                if(company.noOfEmployee<employeeNumber){throw new customError(400,"data is mismathed while changing the employee");}
                company.noOfEmployee-=employeeNumber;
            }
        }
        catch(err){
            throw new customError(400,"something went wrong while changing the emplyoees");
        }
    }
    getTheDataUsingCompanyId=async (companyId)=>{
        try{
            let company=await companyModel.findById(companyId,"shortCompanyId companyName noOfEmployee time");
            if(!company){throw new customError(400,"Company not found with the company id");}
            return company;
        }catch(err){
            throw new customError(400,"something went wrong while computing the company about");
        }
    }
    checkTheCompanyNameToTheUserId=async(userId,companyName)=>{
        try{
            let count =await companyModel.countDocuments({companyName,userId});
            return count;
        }
        catch(err){
            throw new customError(400,"something went wrong while checking");
        }
    }
    updateTheDetailsOfTheCompany=async (companyId,roleId,companyName,about )=>{
        try{
            let company=await companyModel.findById(companyId);
            if(!company){throw new customError(400,"Company not found with the company id");}
            let CheckAdmin=false;
            for(let i of company.adminId){
                if(i==roleId){CheckAdmin=true;}
            }
            if(!CheckAdmin){
                throw new customError(400,"you are not admin,to change");
            }
            if(company.companyName==companyName){
                company.about=about;
                company.save();
                return false;
            }else{
                //check the name
                if(await this.checkTheCompanyNameToTheUserId(company.userId,companyName)){
                    throw new customError(400,"Name aldready taken in to the admin");
                }
                company.companyName=companyName;
                company.about=about;
                company.save().catch((err)=>{
                    throw new customError(400,"Name aldready taken in to the admin");
                })
                return true;
            }
        }
        catch(err){
            console.log(err);
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while updating the company details");
            }
        }
    }
}