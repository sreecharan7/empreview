import express from "express";
import {authorization} from "../../middlewares/authorizer.middleware.js";
import {commentController} from "./comment.controler.js";

const app=express();

const commentC=new commentController();

app.post("/add",authorization,(req,res,next)=>{commentC.addComment(req,res,next)});
app.get("/viewComments",authorization,(req,res,next)=>{commentC.viewComment(req,res,next)});

export default app;