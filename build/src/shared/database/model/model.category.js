"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelCategory = void 0;
const main_1 = require("../../../main");
class ModelCategory {
}
exports.ModelCategory = ModelCategory;
ModelCategory.collection = () => {
    return main_1.database.collection("Categories");
};
ModelCategory.createIndex = () => {
    return ModelCategory.collection().createIndex({ category_name: 1 }, { unique: true });
};
//# sourceMappingURL=model.category.js.map