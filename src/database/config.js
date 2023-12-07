import mongoose  from "mongoose";



export const connect=()=>{
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/empreview");
        console.log("database is connected sucessfully");
    }catch(err){
        console.log("database is not connected");
    }
}