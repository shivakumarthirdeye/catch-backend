"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelOtp = void 0;
const main_1 = require("../../main");
class ModelOtp {
}
exports.ModelOtp = ModelOtp;
ModelOtp.collection = () => {
    return main_1.database.collection("Otp");
};
ModelOtp.createIndex = () => {
    return ModelOtp.collection().createIndex({ 'expire': 1 });
};
//# sourceMappingURL=model.otp.js.map