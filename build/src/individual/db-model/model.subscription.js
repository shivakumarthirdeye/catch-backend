"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelSubscription = void 0;
const main_1 = require("../../main");
class ModelSubscription {
}
exports.ModelSubscription = ModelSubscription;
ModelSubscription.collection = () => {
    return main_1.database.collection("Subscription");
};
ModelSubscription.createIndex = () => {
    return ModelSubscription.collection().createIndex({ order_id: 1 }, { unique: true });
};
//# sourceMappingURL=model.subscription.js.map