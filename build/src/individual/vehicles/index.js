"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleApp = void 0;
const express_1 = __importDefault(require("express"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const multer_1 = __importDefault(require("multer"));
const s3_1 = require("../../shared/s3");
const model_vehicle_1 = require("../db-model/model.vehicle");
require("dotenv").config();
const vehicleApp = express_1.default.Router();
exports.vehicleApp = vehicleApp;
vehicleApp.use(express_1.default.json());
const uploadVehicle = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3_1.s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: "public-read",
        key: function (req, file, cb) {
            var newFileName = Date.now() + "-" + file.originalname;
            var fullPath = "user/vehicle/" + newFileName;
            cb(null, fullPath); //use Date.now() for unique file keys
        },
    }),
});
vehicleApp.get("/", async (req, res) => {
    try {
        const vehicles = await model_vehicle_1.ModelVehicles.collection().find({}).toArray();
        return res.json({ status: "ok", data: vehicles });
    }
    catch (e) {
        console.log(e);
        return res.json({ status: "ok", msg: "Server error" });
    }
});
vehicleApp.post("/", uploadVehicle.single("image"), async (req, res) => {
    const { name, status, color } = req.body;
    try {
        await model_vehicle_1.ModelVehicles.collection().insertOne({
            id: `CWV-${Math.floor(1000000000000000 + Math.random() * 9000000000000)}`,
            name,
            created: new Date(),
            status,
            color,
            image: req.file.location,
        });
        return res.json({ staus: "ok", msg: "Added" });
    }
    catch (e) {
        console.log(e);
        return res.json({ staus: "failed", msg: "Server error" });
    }
});
vehicleApp.patch("/", uploadVehicle.single("image"), async (req, res) => {
    const { name, color, id, status } = req.body;
    let params = {};
    // req.file?.location
    //   ? req.file.location?.length > 0
    //     ? { name, color, status, image: req.file.location }
    //     : { name, color, status }
    //   : { name, color, status };
    if (req.file) {
        params = { name, color, status, image: req.file.location };
    }
    else {
        params = { name, color, status };
    }
    try {
        await model_vehicle_1.ModelVehicles.collection().updateOne({ id }, {
            $set: params,
        }, { upsert: false });
        return res.json({ staus: "ok", msg: "Edited" });
    }
    catch (e) {
        console.log(e);
        return res.json({ staus: "failed", msg: "Server error" });
    }
});
vehicleApp.delete("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        await model_vehicle_1.ModelVehicles.collection().deleteOne({ id });
        return res.json({ staus: "ok", msg: "Deleted" });
    }
    catch (e) {
        console.log(e);
        return res.json({ staus: "failed", msg: "Server error" });
    }
});
//# sourceMappingURL=index.js.map