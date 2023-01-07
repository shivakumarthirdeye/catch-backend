"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelVehicles = void 0;
const main_1 = require("../../main");
class ModelVehicles {
}
exports.ModelVehicles = ModelVehicles;
ModelVehicles.collection = () => {
    return main_1.database.collection("Vehicles");
};
//# sourceMappingURL=model.vehicle.js.map