import { ObjectId } from "mongodb";
import { database } from "../../main";

export interface IVehicles {
  _id?: ObjectId;
  id: string;
  name: string;
  active: boolean;
  created: Date;
  image: string;
  color: string;
}

export class ModelVehicles {
  public static collection = () => {
    return database.collection<IVehicles>("Vehicles");
  };
}
