import { ObjectId } from "mongodb";
import { database } from "../../main";
import { IGeoPoint } from "../../shared/types";

export interface IIndividualUser {
  _id?: ObjectId;
  id?: String;
  created?: Date;
  updated?: Date;
  username?: String;
  phone?: String;
  type?: String;
  vehicle_type?: string;
  is_verified?: Boolean;
  profile_image?: String;
  vehicle_images: String[];
  coordinates: IGeoPoint;
  short_address: string;
  full_address: string;
  status: string;
  vehicle_name: string;
  active: Date;
  email: string;
}

export class ModelIndividualUser {
  public static collection = () => {
    return database.collection<IIndividualUser>("User");
  };

  public static createIndex = () => {
    return ModelIndividualUser.collection().createIndex({
      coordinates: "2dsphere",
    });
  };
}
