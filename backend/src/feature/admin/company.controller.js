import { companyRepository } from "./company.repository.js";

export class companyController{
    constructor(){
        this.companyRepository=new companyRepository();
    }
    getCompanyDetails=async ()=>{

    }   
}