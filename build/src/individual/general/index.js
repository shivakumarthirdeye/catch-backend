"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalApp = void 0;
const express_1 = __importDefault(require("express"));
const model_individual_users_1 = require("../db-model/model.individual.users");
const model_vehicle_1 = require("../db-model/model.vehicle");
const model_subscription_1 = require("../db-model/model.subscription");
require("dotenv").config();
const generalApp = express_1.default.Router();
exports.generalApp = generalApp;
generalApp.use(express_1.default.json());
generalApp.get("/dashboard", async (req, res) => {
    try {
        const vehicle = await model_vehicle_1.ModelVehicles.collection().countDocuments({});
        const driver = await model_individual_users_1.ModelIndividualUser.collection().countDocuments({});
        const revenue = await model_subscription_1.ModelSubscription.collection()
            .find({
            order_status: "successful",
        })
            .toArray();
        let sum = 0;
        revenue === null || revenue === void 0 ? void 0 : revenue.forEach((item) => {
            sum += item.paid;
        });
        return res.json({ vehicle, driver, revenue: sum });
    }
    catch (error) {
        console.log(error);
        return res.json({ status: "ok", msg: "Server error" });
    }
});
generalApp.get("/user/:page", async (req, res) => {
    try {
        const { page } = req.params;
        const count = await model_individual_users_1.ModelIndividualUser.collection().countDocuments({});
        if (!page && page != 0) {
            return res.json({ status: "failed", msg: "Please specify page number" });
        }
        const query = {};
        const skip = page * 10;
        const data = await model_individual_users_1.ModelIndividualUser.collection()
            .aggregate([
            { $skip: skip },
            { $limit: 10 },
            { $sort: { created: -1 } },
            {
                $lookup: {
                    from: "Subscription",
                    localField: "id",
                    foreignField: "user_id",
                    as: "subscription",
                },
            },
            {
                $unwind: {
                    path: "$subscription",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "Vehicles",
                    localField: "vehicle_type",
                    foreignField: "id",
                    as: "vehicle_details",
                },
            },
            {
                $unwind: {
                    path: "$vehicle_details",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])
            .toArray();
        return res.json({ status: "ok", data, total: count, count: data.length });
    }
    catch (e) {
        console.log(e);
        return res.json({ status: "ok", msg: "Server error" });
    }
});
generalApp.get("/block/:id", async (req, res) => {
    const id = req.params.id;
    const user = await model_individual_users_1.ModelIndividualUser.collection().findOne({ id });
    try {
        if (user.status == "blocked") {
            await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id }, {
                $set: {
                    status: "active",
                },
            }, { upsert: false });
            return res.json({ status: "ok", msg: "Activated" });
        }
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id }, {
            $set: {
                status: "blocked",
            },
        }, { upsert: false });
        return res.json({ status: "ok", msg: "blocked" });
    }
    catch (error) {
        console.log(error);
        return res.json({ status: "ok", msg: "Server error" });
    }
});
generalApp.get("/vehicle", async (req, res) => {
    try {
        const data = await model_vehicle_1.ModelVehicles.collection().find({}).toArray();
        return res.json({ status: "ok", data });
    }
    catch (error) {
        return res.json({ status: "failed", data });
    }
});
//# sourceMappingURL=index.js.map