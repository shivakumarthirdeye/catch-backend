"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
require("dotenv").config;
var AWS = require('aws-sdk');
exports.s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
//# sourceMappingURL=s3.js.map