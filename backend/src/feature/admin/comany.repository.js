import mongoose from "mongoose";
import { companyschema } from "./company.schema.js";
import { customError } from "../../middlewares/error.middleware.js";

const companyModel=mongoose.model("company",companyschema);


export class companyRepository{
    add=async (companyName)=>{
        try{
            const newCompany=companyModel.create({companyName});
            // await newCompany.save();
            return await newCompany;
        }
        catch(err){
            console.log(err);
           throw new customError(400,"something went wrong while creating the company");
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
}