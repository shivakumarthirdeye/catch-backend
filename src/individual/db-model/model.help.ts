import { ObjectId } from "mongodb";
import { database } from "../../main";

export interface IHelp {
  _id?: ObjectId;
  id: string;
  name: string;
  phone: string;
  request: string;
  created: Date;
}

export class ModelHelp {
  public static collection = () => {
    return database.collection<IHelp>("Help");
  };
}
