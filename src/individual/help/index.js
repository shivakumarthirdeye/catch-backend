import express from "express";
import { ModelHelp } from "../db-model/model.help";
require("dotenv").config();

const helpApp = express.Router();

helpApp.use(express.json());

helpApp.post("/", async (req, res) => {
  const { name, phone, request } = req.body;
  try {
    await ModelHelp.collection().insertOne({
      id: `CWH-${Math.floor(1000000000000000 + Math.random() * 9000000000000)}`,
      created: new Date(),
      name,
      phone,
      request,
    });
    return res.json({ status: "ok", msg: "Successfully registered" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "failed", msg: "Server error" });
  }
});

export { helpApp };
