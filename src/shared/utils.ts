import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";

const signingKey = process.env.SIGNING_KEY ?? "test-key";
const expireDuration = 60 * 60; // 1 hour in seconds

export const getObjectId = (id: string | ObjectId) => new ObjectId(id);

export const jwtUtils = {
    encode: (payload: JWTPayload) => {
        return jwt.sign(payload, signingKey, { algorithm: 'HS256', expiresIn: "7 days" });
    },
    decode: (token: string): JWTPayload => {
        return jwt.verify(token, signingKey) as JWTPayload;
    }
};

export const dayToSecond = (days: number) => {
    const now = new Date()
    now.setDate(now.getDate() + days);
    // convert day to second
    return now.getTime() / 1000
}

export const isProduction = () => process.env.NODE_ENV === "production";