import express from "express";
import {authorization} from "../../middlewares/authorizer.middleware.js";
import { requestToUserController } from "./requsetToUser.controller.js";

const app=express.Router();

const requestToUserC=new requestToUserController();

app.post("/add",authorization,(req,res,next)=>{requestToUserC.addUser(req,res,next)});
export default app;