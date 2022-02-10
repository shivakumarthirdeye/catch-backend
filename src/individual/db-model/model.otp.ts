import { ObjectId } from "mongodb";
import { database } from "../../main";

export interface IOtp {
    _id?: ObjectId,
    otp:String,
    phone: String,
    expire: Date,
    type: String,
}

export class ModelOtp {

    public static collection = () => {
        return database.collection<IOtp>("Otp");
    }

    public static createIndex= () => {
        return ModelOtp.collection().createIndex({ 'expire': 1 });
    }

}