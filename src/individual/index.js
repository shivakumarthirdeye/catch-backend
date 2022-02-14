import express from "express";
require("dotenv").config();
import sanitize from "express-mongo-sanitize";
import { authApp } from "./authentication";
import json from "express";
import { subApp } from "./subscription";
import { userApp } from "./user";
import { vehicleApp } from "./vehicles";
import { generalApp } from "./general";
import { helpApp } from "./help";

const appIndividual = express.Router();

appIndividual.use(express.json());

appIndividual.use(json());
appIndividual.use(sanitize());
appIndividual.use("/v1/auth", authApp);
appIndividual.use("/v1/sub", subApp);
appIndividual.use("/v1/user", userApp);
appIndividual.use("/v1/vehicle", vehicleApp);
appIndividual.use("/v1/general", generalApp);
appIndividual.use("/v1/help", helpApp);
export { appIndividual };
