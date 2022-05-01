"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userApp = void 0;
const express_1 = __importDefault(require("express"));
const model_individual_users_1 = require("../db-model/model.individual.users");
const model_subscription_1 = require("../db-model/model.subscription");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const multer_1 = __importDefault(require("multer"));
const s3_1 = require("../../shared/s3");
const model_vehicle_1 = require("../db-model/model.vehicle");
require("dotenv").config();
const userApp = express_1.default.Router();
exports.userApp = userApp;
userApp.use(express_1.default.json());
const uploadProfile = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3_1.s3,
        acl: "public-read",
        bucket: process.env.AWS_S3_BUCKET_NAME,
        key: function (req, file, cb) {
            var newFileName = Date.now() + "-" + file.originalname;
            var fullPath = "user/vehicle/" + newFileName;
            cb(null, fullPath); //use Date.now() for unique file keys
        },
    }),
});
const uploadVehicle = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3_1.s3,
        acl: "public-read",
        bucket: process.env.AWS_S3_BUCKET_NAME,
        key: function (req, file, cb) {
            var newFileName = Date.now() + "-" + file.originalname;
            var fullPath = "user/vehicle/" + newFileName;
            cb(null, fullPath); //use Date.now() for unique file keys
        },
    }),
});
userApp.get("/", authenticate_1.default, async (req, res) => {
    const id = req.user.id;
    try {
        const user = await model_individual_users_1.ModelIndividualUser.collection().findOne({ id });
        if (!user) {
            return res.json({ status: "failed", msg: "User not found" });
        }
        const user_sub = await model_subscription_1.ModelSubscription.collection().findOne({
            user_id: id,
        });
        const vehicle_type = await model_vehicle_1.ModelVehicles.collection().findOne({
            id: user.vehicle_type,
        });
        return res.json({
            status: "ok",
            data: Object.assign(Object.assign(Object.assign({}, user), user_sub), { vehicle_data: vehicle_type }),
        });
    }
    catch (e) {
        console.log(e);
        return res.json({ status: "ok", msg: "Server error" });
    }
});
userApp.patch("/active", authenticate_1.default, async (req, res) => {
    const id = req.user.id;
    try {
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id }, {
            $set: {
                active: new Date(),
            },
        }, { upsert: false });
        return res.json({ status: "ok", msg: "updated" });
    }
    catch (error) {
        console.log(error);
        return res.json({ status: "ok", msg: "Server error" });
    }
});
userApp.post("/edit", authenticate_1.default, uploadProfile.single("profile_image"), async (req, res) => {
    var _a, _b;
    const id = req.user.id;
    let extra_params = {};
    if (((_a = req.file) === null || _a === void 0 ? void 0 : _a.location) && ((_b = req.file.location) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        extra_params = { profile_image: req.file.location };
    }
    const subs = await model_subscription_1.ModelSubscription.collection().findOne({ user_id: id });
    if (!subs.status || subs.status != "active") {
        return res.json({
            status: "failed",
            msg: "Unsubscribed or subscription expired",
        });
    }
    try {
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id }, {
            $set: Object.assign(Object.assign({}, req.body), extra_params),
        }, { upsert: false });
        return res.json({ status: "ok", msg: "Updated successfully" });
    }
    catch (e) {
        console.log(e);
        return res.json({ status: "failed", msg: "Server error" });
    }
});
userApp.post("/local", async (req, res) => {
    const { lat, lng, type } = req.body;
    const query = (type === null || type === void 0 ? void 0 : type.length) > 0
        ? { vehicle_type: type, status: "active" }
        : { status: "active" };
    try {
        const data = await model_individual_users_1.ModelIndividualUser.collection()
            .aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    maxDistance: 10000,
                    distanceField: "dist.calculated",
                    includeLocs: "dist.location",
                    spherical: true,
                    query: query,
                },
            },
            {
                $lookup: {
                    from: "Vehicles",
                    localField: "vehicle_type",
                    foreignField: "id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])
            .toArray();
        return res.json({ status: "ok", data });
    }
    catch (e) {
        return res.json({ staus: "failed", msg: "Server error" });
    }
});
userApp.post("/upload", authenticate_1.default, uploadVehicle.array("vehicle_images[]", 4), async (req, res) => {
    const id = req.user.id;
    const images = [];
    if (req.files) {
        req.files.forEach((item) => {
            images.push({ uri: item.location });
        });
    }
    try {
        if (!(await model_individual_users_1.ModelIndividualUser.collection().findOne({ id }))) {
            return res.json({ staus: "failed", msg: "User not found" });
        }
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id }, {
            $push: {
                vehicle_images: { $each: images },
            },
        }, { upsert: false });
        return res.json({ status: "ok", msg: "Uploaded" });
    }
    catch (e) {
        return res.json({ status: "failed", msg: "Server error" });
    }
});
userApp.delete("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        await model_individual_users_1.ModelIndividualUser.collection().deleteOne({ id });
        await model_subscription_1.ModelSubscription.collection().deleteOne({ user_id: id });
        return res.json({ staus: "ok", msg: "Deleted" });
    }
    catch (e) {
        console.log(e);
        return res.json({ staus: "failed", msg: "Server error" });
    }
});
userApp.post("/remove_img", authenticate_1.default, async (req, res) => {
    const id = req.user.id;
    const uri = req.body.uri;
    try {
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id }, {
            $pull: {
                vehicle_images: { uri },
            },
        }, { upsert: false });
        return res.json({ status: "ok", msg: "Removed" });
    }
    catch (e) {
        console.log(e);
        return res.json({ status: "failed", msg: "Failed" });
    }
});
userApp.post("/deactivate", authenticate_1.default, async (req, res) => {
    const id = req.user.id;
    try {
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id }, {
            $set: {
                status: "inactive",
            },
        });
        return res.json({ status: "ok", msg: "Deactivated" });
    }
    catch (error) {
        console.log(error);
        return res.json({ status: "failed", msg: "Server error" });
    }
});
//# sourceMappingURL=index.js.map