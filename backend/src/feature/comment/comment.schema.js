import mongoose  from "mongoose";

export const comment=new mongoose.Schema({
    rating:{type:Number,require:true},
    msg:{type:String,require:true,default:""},
    byWhomId:{type:mongoose.Schema.Types.ObjectId,ref:"roles",require:true},
    ToWhomId:{type:mongoose.Schema.Types.ObjectId,ref:"roles",require:true},
})