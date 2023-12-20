import {companyRepository} from "../../backend/src/feature/company/company.repository.js"
import {rolesRepository} from "../../backend/src/feature/rolesAndRequest/roles.repository.js";

export class requestToBackend{
    constructor(){
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
    }
    checkTheCompanyToUserIdToAdmin=async (userId,rolesId)=>{
        const role=await this.rolesRepository.checkUserIdToAdminId(userId,rolesId);
        return role;
    }
}