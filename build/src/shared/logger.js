"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerIndividual = exports.loggerBusiness = exports.loggerAdmin = exports.loggerRoot = void 0;
const winston_1 = __importDefault(require("winston"));
const logFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple());
const loggerRoot = winston_1.default.createLogger({
    level: "silly",
    format: logFormat,
    defaultMeta: { service: "catch-api" },
    transports: [
        new winston_1.default.transports.Console(),
        //new winston.transports.File({ filename: 'combined.log' })
    ],
});
exports.loggerRoot = loggerRoot;
const loggerBusiness = winston_1.default.createLogger({
    level: "silly",
    format: logFormat,
    defaultMeta: { service: "catch-business" },
    transports: [
        new winston_1.default.transports.Console(),
        //new winston.transports.File({ filename: 'combined.log' })
    ],
});
exports.loggerBusiness = loggerBusiness;
const loggerIndividual = winston_1.default.createLogger({
    level: "silly",
    format: logFormat,
    defaultMeta: { service: "catch-individual" },
    transports: [
        new winston_1.default.transports.Console(),
        //new winston.transports.File({ filename: 'combined.log' })
    ],
});
exports.loggerIndividual = loggerIndividual;
const loggerAdmin = winston_1.default.createLogger({
    level: "silly",
    format: logFormat,
    defaultMeta: { service: "catch-admin" },
    transports: [
        new winston_1.default.transports.Console(),
        //new winston.transports.File({ filename: 'combined.log' })
    ],
});
exports.loggerAdmin = loggerAdmin;
//# sourceMappingURL=logger.js.map