import express from "express";
import { ModelIndividualUser } from "../db-model/model.individual.users";
import { ModelSubscription } from "../db-model/model.subscription";
import authenticateToken from "../middleware/authenticate";
require("dotenv").config();

const subApp = express.Router();

subApp.use(express.json());

subApp.post("/", authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const type = req.body.type;
  const status = req.body.status;
  const payment_id = req.body.payment_id;
  const user = await ModelIndividualUser.collection().findOne({ id: user_id });
  if (!user) {
    return res.json({ status: "failed", msg: "User not found" });
  }

  if (await ModelSubscription.collection().findOne({ user_id })) {
    return res.json({ status: "failed", msg: "Already subscribed" });
  }

  if (!type) {
    return res.json({ status: "failed", msg: "Subscription plan is missing" });
  }

  if (type == "monthly" || type == "yearly") {
    try {
      ModelSubscription.collection().insertOne({
        order_id: `CWO-${Math.floor(
          1000000000000000 + Math.random() * 9000000000000
        )}`,
        plan: type,
        created: new Date(),
        paid: type == "monthly" ? 100 : 1000,
        user_id: user.id,
        order_status: status,
        status: status == "successful" ? "active" : "inactive",
        updated: new Date(),
        payment_id,
        expires:
          type == "monthly"
            ? new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
            : new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      });
      return res.json({ status: "ok", msg: "Successfully subscribed" });
    } catch (e) {
      console.log(e);
      return res.json({ status: "ok", msg: "Server error" });
    }
  } else {
    return res.json({ status: "failed", msg: "Subscription plan is invalid" });
  }
});

export { subApp };
