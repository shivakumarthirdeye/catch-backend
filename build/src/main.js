"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.app = void 0;
if (process.env.NODE_ENV === "local") {
    let config = require("dotenv").config;
    config();
}
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const individual_1 = require("./individual");
const database_1 = require("./shared/database");
const logger_1 = require("./shared/logger");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
let uri = (_a = process.env.DB_URL) !== null && _a !== void 0 ? _a : "";
const app = (0, express_1.default)();
exports.app = app;
const database = new database_1.Database();
exports.database = database;
database
    .connect()
    .then(() => {
    console.log("Connected");
})
    .catch((err) => {
    logger_1.loggerRoot.error(err.message);
    process.exit(0);
});
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use("/api/", individual_1.appIndividual);
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend-build")));
app.get("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend-build", "index.html"));
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "404 path not found",
        data: {
            method: req.method,
            path: req.originalUrl,
        },
    });
});
// global error handler
app.use((err, req, res, next) => {
    if (res.headersSent)
        return next(err);
    console.log(err);
    res.status(500).json({
        message: "500 server error",
        data: {
            method: req.method,
            path: req.originalUrl,
        },
    });
    console.error(err);
});
app.listen(process.env.PORT, () => {
    logger_1.loggerRoot.info(`server is running on port: ${process.env.PORT}....`);
});
//# sourceMappingURL=main.js.map