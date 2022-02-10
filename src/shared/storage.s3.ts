import { StorageEngine } from "multer";
import aws from "aws-sdk";
import { Req } from "./types";

interface CustomFileResult extends Partial<Express.Multer.File> {
    name?: string,
    s3Location?: string
}

type TCB = (err: any, info?: CustomFileResult) => void

export class StorageS3 implements StorageEngine {

    private static _bucket: aws.S3;

    constructor(private path: string) { }

    public static get bucket() {
        if (StorageS3._bucket === undefined) {
            StorageS3._bucket = new aws.S3({
                credentials: {
                    accessKeyId: process.env.AWS_S3_BUCKET_NAME ?? "",
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ""
                }
            });
        }
        return StorageS3._bucket;
    }

    public _handleFile = (_req: Req, file: Express.Multer.File, cb: TCB) => {
        const filename = `${Date.now()}_${file.originalname}`;
        const params: aws.S3.PutObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
            Key: `${this.path}/${filename}`,
            Body: file.stream
        };
        StorageS3.bucket.upload(params, (err, data) => {
            console.log(err);
            if (err) throw cb(err);
            else cb(null, { name: filename, s3Location: data.Location });
        });
    }

    public _removeFile = (_req: Req, file: Express.Multer.File & { name: string },
        cb: (err: Error | null) => void) => {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
            Key: `${this.path}/${file.name}`,
        };
        StorageS3.bucket.deleteObject(params, (err, data) => {
            console.log(err);
            if (err) cb(err);
            else cb(null);
        });
    }
}