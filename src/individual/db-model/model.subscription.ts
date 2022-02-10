import { ObjectId } from "mongodb";
import { database } from "../../main";

export interface ISubscription {
  _id?: ObjectId;
  id?: String;
  order_id?: string;
  plan: "monthly" | "yearly";
  created: Date;
  updated: String;
  paid: string;
  user_id: string;
  order_status: "pending" | "failed" | "successful";
  status: "active" | "expired" | "inactive";
  expires: Date;
}

export class ModelSubscription {
  public static collection = () => {
    return database.collection<ISubscription>("Subscription");
  };

  public static createIndex = () => {
    return ModelSubscription.collection().createIndex(
      { order_id: 1 },
      { unique: true }
    );
  };
}
