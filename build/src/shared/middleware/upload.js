"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const { s3 } = require("../../main");
const fs = require("fs");
const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    // Setting up S3 upload parameters
    const params = {
        Bucket: "catch",
        Key: "test.jpg",
        Body: fileContent,
    };
    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        return data.Location;
    });
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=upload.js.map