import express from "express";
import {authorization} from "../../middlewares/authorizer.middleware.js";
import { rolesAndRequestController } from "./rolesAndRequest.controller.js";

const app=express.Router();
const rolesAndRequestC=new rolesAndRequestController();


app.get("/dataRoles",authorization,(req,res,next)=>{rolesAndRequestC.dataOfUserRoles(req,res,next)});
app.get("/dataRequests",authorization,(req,res,next)=>{rolesAndRequestC.dataOfUserRequests(req,res,next)});
app.post("/createRolesAndRequest",authorization,(req,res,next)=>{rolesAndRequestC.addNewRole(req,res,next)});

export default app;