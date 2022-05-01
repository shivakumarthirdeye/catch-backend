"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpApp = void 0;
const express_1 = __importDefault(require("express"));
const model_help_1 = require("../db-model/model.help");
require("dotenv").config();
const helpApp = express_1.default.Router();
exports.helpApp = helpApp;
helpApp.use(express_1.default.json());
helpApp.post("/", async (req, res) => {
    const { name, phone, request } = req.body;
    try {
        await model_help_1.ModelHelp.collection().insertOne({
            id: `CWH-${Math.floor(1000000000000000 + Math.random() * 9000000000000)}`,
            created: new Date(),
            name,
            phone,
            request,
        });
        return res.json({ status: "ok", msg: "Successfully registered" });
    }
    catch (error) {
        console.log(error);
        return res.json({ status: "failed", msg: "Server error" });
    }
});
//# sourceMappingURL=index.js.map