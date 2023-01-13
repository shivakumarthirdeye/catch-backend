"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class StorageS3 {
    constructor(path) {
        this.path = path;
        this._handleFile = (_req, file, cb) => {
            var _a;
            const filename = `${Date.now()}_${file.originalname}`;
            const params = {
                Bucket: (_a = process.env.AWS_S3_BUCKET_NAME) !== null && _a !== void 0 ? _a : "",
                Key: `${this.path}/${filename}`,
                Body: file.stream
            };
            StorageS3.bucket.upload(params, (err, data) => {
                console.log(err);
                if (err)
                    throw cb(err);
                else
                    cb(null, { name: filename, s3Location: data.Location });
            });
        };
        this._removeFile = (_req, file, cb) => {
            var _a;
            const params = {
                Bucket: (_a = process.env.AWS_S3_BUCKET_NAME) !== null && _a !== void 0 ? _a : "",
                Key: `${this.path}/${file.name}`,
            };
            StorageS3.bucket.deleteObject(params, (err, data) => {
                console.log(err);
                if (err)
                    cb(err);
                else
                    cb(null);
            });
        };
    }
    static get bucket() {
        var _a, _b;
        if (StorageS3._bucket === undefined) {
            StorageS3._bucket = new aws_sdk_1.default.S3({
                credentials: {
                    accessKeyId: (_a = process.env.AWS_S3_BUCKET_NAME) !== null && _a !== void 0 ? _a : "",
                    secretAccessKey: (_b = process.env.AWS_SECRET_ACCESS_KEY) !== null && _b !== void 0 ? _b : ""
                }
            });
        }
        return StorageS3._bucket;
    }
}
exports.StorageS3 = StorageS3;
//# sourceMappingURL=storage.s3.js.map