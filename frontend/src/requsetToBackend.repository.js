import {companyRepository} from "../../backend/src/feature/admin/company.repository.js"
import {rolesRepository} from "../../backend/src/feature/rolesAndRequest/roles.repository.js";

export class requestToBackend{
    constructor(){
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
    }
    checkTheCompanyToUserIdToAdmin=async (userId,companyId)=>{
        const company=await this.rolesRepository.checkUserIdToAdminId(userId,companyId);
        if( company){
            return company.companyName;
        }
        else{
            return false;
        }
    }
}