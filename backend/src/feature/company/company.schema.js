import mongoose from "mongoose"

export const companyschema=new mongoose.Schema({
    companyName:{type:"String",required:true},
    shortCompanyId:{type:"Number",required:true,unique:true,default:0},
    noOfEmployee:{type:"Number",required:true,default:0},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users",require:true},
    adminId:{type:[mongoose.Schema.Types.ObjectId],ref:"roles",require:true,default:[]},
    about:{type:"String",require:true,default:""},
    time:{type:"Date",required:true,default:Date.now()},
});

companyschema.index({companyName:1,userId:1},{unique:true});


companyschema.pre("save",async function(next){
    if(this.isNew){
        const generatedUniqueNumber = Math.floor(Math.random() * 100000000);
        let existingcheck=await this.constructor.findOne({shortCompanyId:generatedUniqueNumber});
        while(true){
            existingcheck=await this.constructor.findOne({shortCompanyId:generatedUniqueNumber});
            if(!existingcheck){break;}
        }
        this.shortCompanyId=generatedUniqueNumber;
    }
    next();
})

companyschema.path("userId").validate(async function(value){
    const count =await this.constructor.countDocuments({userId:value,companyName:this.companyName});
    if(count&&count>1){return false}
    return true;
})