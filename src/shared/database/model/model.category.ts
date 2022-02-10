import { ObjectId } from "mongodb";
import { database } from "../../../main";

export interface ISubCategory {
    id: string,// always use user generated shortid
    name: string,
    tags: string[]
}
export interface ICategory {
    _id?: ObjectId,
    created: Date,
    category_name: String,
    category_tags: String[],
    category_image: String,
    category_id: String,

}

export class ModelCategory {

    public static collection = () => {
        return database.collection<ICategory>("Categories");
    }

    public static createIndex = () => {
        return ModelCategory.collection().createIndex({ category_name: 1 }, { unique: true });
    }
}

