import { ModelIndividualUser } from "../../individual/db-model/model.individual.users";
import { MongoClient, Db } from "mongodb";
import { loggerRoot } from "../logger";

export class Database {
  private _client!: MongoClient;
  private _db!: Db;

  public get client() {
    return this._client;
  }
  public get db() {
    return this._db;
  }

  public collection = <T>(name: string) => {
    return this._db.collection<T>(name);
  };

  public connect = async () => {
    const url: any =
      process.env.NODE_ENV === "development"
        ? process.env.DB_URL_DEV
        : process.env.DB_URL;
    console.log(url, "url");
    if (!process.env.DB_URL) throw new Error("database url not found");

    this._client = new MongoClient(url);
    await this._client.connect();
    this._db = this._client.db();
    await this._createIndexes();
    loggerRoot.info("connected to database...");
  };

  private _createIndexes = async () => {
    await Promise.all([ModelIndividualUser.createIndex()]);
  };
}
