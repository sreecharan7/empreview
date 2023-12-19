import { customError } from "../../middlewares/error.middleware.js";
import { companyRepository } from "./company.repository.js";

export class companyController{
    constructor(){
        this.companyRepository=new companyRepository();
    }
    getCompanyDetails=async (req,res,next)=>{
        try{
            const companyId=req.body["companyId"];
            if(!companyId){throw new customError(400,"Must provide the companyId");}
            //check whether the userid macthes with the cpompany id
            const company=await this.companyRepository.getTheDataUsingCompanyId(companyId);
            res.json(company);
        }
        catch(err){
            next(err);
        }
    }   
}