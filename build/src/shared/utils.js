"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.dayToSecond = exports.jwtUtils = exports.getObjectId = void 0;
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signingKey = (_a = process.env.SIGNING_KEY) !== null && _a !== void 0 ? _a : "test-key";
const expireDuration = 60 * 60; // 1 hour in seconds
const getObjectId = (id) => new mongodb_1.ObjectId(id);
exports.getObjectId = getObjectId;
exports.jwtUtils = {
    encode: (payload) => {
        return jsonwebtoken_1.default.sign(payload, signingKey, { algorithm: 'HS256', expiresIn: "7 days" });
    },
    decode: (token) => {
        return jsonwebtoken_1.default.verify(token, signingKey);
    }
};
const dayToSecond = (days) => {
    const now = new Date();
    now.setDate(now.getDate() + days);
    // convert day to second
    return now.getTime() / 1000;
};
exports.dayToSecond = dayToSecond;
const isProduction = () => process.env.NODE_ENV === "production";
exports.isProduction = isProduction;
//# sourceMappingURL=utils.js.map