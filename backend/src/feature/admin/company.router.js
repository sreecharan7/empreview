import express from "express"
import {authorization} from "../../middlewares/authorizer.middleware.js";
import { companyController } from "./company.controller.js";

const companyC=new companyController();

const app=express.Router();



export default app;