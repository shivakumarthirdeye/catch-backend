import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export interface JWTPayload {
    _id: string | ObjectId,
}

export interface Req extends Request {jwtPayload: JWTPayload};
export interface Res extends Response {};

export type Middleware = (req: Req, res: Res, next: () => void) => void;
export type Controller = (req: Req, res: Res) => void;
export type HelperReturn = Promise<[number, string, {} | []]>;
export interface IGeoPoint {
    type: "Point",
    coordinates: [number, number]
}
export interface IOpenCloseTiming {
    day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday",
    openingTime: Date,
    closingTime: Date,
    available: boolean
}

/*export interface IAuthUser extends IJWTPayload {
    type: "business" | "admin" | "individual",
    name: string,
    contact: string,
    address: string
}*/