"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelIndividualUser = void 0;
const main_1 = require("../../main");
class ModelIndividualUser {
}
exports.ModelIndividualUser = ModelIndividualUser;
ModelIndividualUser.collection = () => {
    return main_1.database.collection("User");
};
ModelIndividualUser.createIndex = () => {
    return ModelIndividualUser.collection().createIndex({
        coordinates: "2dsphere",
    });
};
//# sourceMappingURL=model.individual.users.js.map