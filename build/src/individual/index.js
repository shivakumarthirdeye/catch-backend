"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appIndividual = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const authentication_1 = require("./authentication");
const express_2 = __importDefault(require("express"));
const subscription_1 = require("./subscription");
const user_1 = require("./user");
const vehicles_1 = require("./vehicles");
const general_1 = require("./general");
const help_1 = require("./help");
const appIndividual = express_1.default.Router();
exports.appIndividual = appIndividual;
appIndividual.use(express_1.default.json());
appIndividual.use((0, express_2.default)());
appIndividual.use((0, express_mongo_sanitize_1.default)());
appIndividual.use("/v1/auth", authentication_1.authApp);
appIndividual.use("/v1/sub", subscription_1.subApp);
appIndividual.use("/v1/user", user_1.userApp);
appIndividual.use("/v1/vehicle", vehicles_1.vehicleApp);
appIndividual.use("/v1/general", general_1.generalApp);
appIndividual.use("/v1/help", help_1.helpApp);
//# sourceMappingURL=index.js.map