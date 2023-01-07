"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const model_individual_users_1 = require("../../individual/db-model/model.individual.users");
const mongodb_1 = require("mongodb");
const logger_1 = require("../logger");
class Database {
    constructor() {
        this.collection = (name) => {
            return this._db.collection(name);
        };
        this.connect = async () => {
            const url = process.env.NODE_ENV === "development"
                ? process.env.DB_URL_DEV
                : process.env.DB_URL;
            console.log(url, "url");
            if (!process.env.DB_URL)
                throw new Error("database url not found");
            this._client = new mongodb_1.MongoClient(url);
            await this._client.connect();
            this._db = this._client.db();
            await this._createIndexes();
            logger_1.loggerRoot.info("connected to database...");
        };
        this._createIndexes = async () => {
            await Promise.all([model_individual_users_1.ModelIndividualUser.createIndex()]);
        };
    }
    get client() {
        return this._client;
    }
    get db() {
        return this._db;
    }
}
exports.Database = Database;
//# sourceMappingURL=index.js.map