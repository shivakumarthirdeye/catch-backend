import express from "express";
import { ModelIndividualUser } from "../db-model/model.individual.users";
import { ModelVehicles } from "../db-model/model.vehicle";
import { ModelSubscription } from "../db-model/model.subscription";
require("dotenv").config();

const generalApp = express.Router();

generalApp.use(express.json());

generalApp.get("/dashboard", async (req, res) => {
  try {
    const vehicle = await ModelVehicles.collection().countDocuments({});
    const driver = await ModelIndividualUser.collection().countDocuments({});
    const revenue = await ModelSubscription.collection()
      .find({
        order_status: "successful",
      })
      .toArray();

    let sum = 0;
    revenue?.forEach((item) => {
      sum += item.paid;
    });

    return res.json({ vehicle, driver, revenue: sum });
  } catch (error) {
    console.log(error);
    return res.json({ status: "ok", msg: "Server error" });
  }
});

generalApp.get("/user/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const count = await ModelIndividualUser.collection().countDocuments({});
    if (!page && page != 0) {
      return res.json({ status: "failed", msg: "Please specify page number" });
    }
    const query = {};
    const skip = page * 10;
    const data = await ModelIndividualUser.collection()
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
  } catch (e) {
    console.log(e);
    return res.json({ status: "ok", msg: "Server error" });
  }
});

generalApp.get("/block/:id", async (req, res) => {
  const id = req.params.id;
  const user = await ModelIndividualUser.collection().findOne({ id });

  try {
    if (user.status == "blocked") {
      await ModelIndividualUser.collection().updateOne(
        { id },
        {
          $set: {
            status: "active",
          },
        },
        { upsert: false }
      );
      return res.json({ status: "ok", msg: "Activated" });
    }
    await ModelIndividualUser.collection().updateOne(
      { id },
      {
        $set: {
          status: "blocked",
        },
      },
      { upsert: false }
    );
    return res.json({ status: "ok", msg: "blocked" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "ok", msg: "Server error" });
  }
});

generalApp.get("/vehicle", async (req, res) => {
  try {
    const data = await ModelVehicles.collection().find({}).toArray();
    return res.json({ status: "ok", data });
  } catch (error) {
    return res.json({ status: "failed", data });
  }
});

export { generalApp };
