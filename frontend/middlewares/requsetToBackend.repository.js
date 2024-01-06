import {companyRepository} from "../../backend/src/feature/company/company.repository.js"
import {rolesRepository} from "../../backend/src/feature/rolesAndRequest/roles.repository.js";
import {requestToUserRepository} from "../../backend/src/feature/requestToUser/requestToUser.repository.js"
export class requestToBackend{
    constructor(){
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
        this.requestToUserRepository=new requestToUserRepository();
    }
    checkTheCompanyToUserIdToAdmin=async (userId,rolesId)=>{
        const role=await this.rolesRepository.checkUserIdToAdminId(userId,rolesId);
        return role;
    }
    getCompanyDetails=async (companyId,roleId)=>{
        const company=await this.companyRepository.checkTheAdminUseCompanyIdAndGetData(companyId,roleId);
        return company;
    }
    findTheRequest=async (companyId,userId)=>{
        let a=await this.requestToUserRepository.companyDetailsToUser(companyId,userId);
        return a;
    }
    getTheDataOfEmployee=async (roleId)=>{
        const employee=await this.rolesRepository.getTheDataOfEmployee(roleId);
        return employee;
    }
}