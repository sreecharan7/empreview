import express from "express"
import {authorization} from "../../middlewares/authorizer.middleware.js";
import { companyController } from "./company.controller.js";

const companyC=new companyController();

const app=express.Router();

app.get("/about",(req,res,next)=>{companyC.getCompanyDetails(req,res,next);})
app.put("/companyDetails",authorization,(req,res,next)=>{companyC.UpdateCompanyDetails(req,res,next)});

export default app;