"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageDisk = void 0;
const fs_1 = __importDefault(require("fs"));
class StorageDisk {
    constructor(path) {
        this.path = path;
        this._handleFile = (_req, file, cb) => {
            const filename = `${Date.now()}_${file.originalname}`;
            const writeStream = fs_1.default.createWriteStream(`${this.path}/${filename}`);
            file.stream.pipe(writeStream)
                .on("finish", () => {
                cb(null, { name: filename });
            }).on("error", (err) => {
                cb(err);
            });
        };
        this._removeFile = (_req, file, cb) => {
            const fileUri = `${this.path}/${file.name}`;
            fs_1.default.unlink(fileUri, (err) => {
                if (err)
                    cb(err);
                else
                    cb(null);
            });
        };
        if (!fs_1.default.existsSync(path))
            fs_1.default.mkdirSync(path, { recursive: true });
    }
}
exports.StorageDisk = StorageDisk;
//# sourceMappingURL=storage.disk.js.map