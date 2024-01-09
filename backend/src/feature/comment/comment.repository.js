import { comment } from "./comment.schema.js";
import mongoose  from "mongoose";
import { customError } from "../../middlewares/error.middleware";

const commentModel=mongoose.model("comment",comment);

export class commentRepository{
    add=async(rating,msg,byWhomID,toWhomId)=>{
        try{
            const newComment=new commentModel({
                rating:rating,
                msg:msg,
                byWhom:byWhomID,
                toWhom:toWhomId
            });
            await newComment.save();
            return newComment;
        }catch(err){
            throw new customError(400,"something went wrong while adding the comment");
        }
    }
}