import { StorageEngine } from "multer";
import { Req } from "./types";
import fs from "fs";

interface CustomFileResult extends Partial<Express.Multer.File> {
    name?: string,
    s3Location?: string
}

type TCB = (err: any, info?: CustomFileResult) => void

export class StorageDisk implements StorageEngine {

    constructor(private path: string) {
        if(!fs.existsSync(path))
            fs.mkdirSync(path,{recursive:true});
    }

    public _handleFile = (_req: Req, file: Express.Multer.File, cb: TCB) => {
        const filename = `${Date.now()}_${file.originalname}`;
        const writeStream = fs.createWriteStream(`${this.path}/${filename}`);
        file.stream.pipe(writeStream)
            .on("finish", () => {
                cb(null, { name: filename });
            }).on("error", (err) => {
                cb(err);
            })
    }

    public _removeFile = (_req: Req, file: Express.Multer.File & { name: string },
        cb: (err: Error | null) => void) => {
        const fileUri = `${this.path}/${file.name}`;
        fs.unlink(fileUri, (err) => {
            if (err) cb(err);
            else cb(null);
        });
    }
}