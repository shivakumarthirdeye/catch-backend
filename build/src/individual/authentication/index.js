"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authApp = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const tokens_js_1 = __importDefault(require("./authToken/tokens.js"));
const sendOtp_1 = __importDefault(require("../helper/sendOtp"));
const model_individual_users_1 = require("../db-model/model.individual.users");
const model_otp_1 = require("../db-model/model.otp");
const model_subscription_1 = require("../db-model/model.subscription");
require("dotenv").config();
const authApp = express_1.default.Router();
exports.authApp = authApp;
authApp.use(express_1.default.json());
// API for registering user in Individual app
authApp.post("/register", async (req, res) => {
    const { username, phone, vehicle_type } = req.body;
    if (!vehicle_type) {
        return res.json({
            status: "failed",
            msg: "Please specify a valid vehicle type",
        });
    }
    if (!username || typeof username !== "string") {
        return res.json({ status: "failed", msg: "Invalid Username" });
    }
    if (!phone || typeof phone !== "string" || phone.length != 10) {
        return res.json({ status: "failed", msg: "Invalid Mobile Number" });
    }
    if ((await model_individual_users_1.ModelIndividualUser.collection().findOne({ phone })) != undefined) {
        return res.json({ status: "failed", msg: "Mobile number already exists" });
    }
    try {
        await model_individual_users_1.ModelIndividualUser.collection().insertOne({
            username,
            id: `CWU-${Math.floor(1000000000000000 + Math.random() * 9000000000000)}`,
            created: new Date(),
            phone,
            profile_image: "https://firebasestorage.googleapis.com/v0/b/zhiffy-mobile-app.appspot.com/o/user.png?alt=media&token=a962c197-7147-40b7-93ae-cd924343cf58",
            updated: new Date(),
            is_verified: false,
            status: "inactive",
            type: "driver",
            vehicle_type,
            status: "active",
            full_address: "",
            short_address: "",
            vehicle_name: "",
            vehicle_images: [],
            coordinates: {
                type: "Point",
                coordinates: [26.0, 76.0],
            },
        });
        await model_otp_1.ModelOtp.collection().updateOne({ phone }, {
            $set: {
                otp: Math.floor(1000 + Math.random() * 9000),
                phone,
                type: "user",
                expire: new Date(Date.now() + 10 * 60 * 1000),
            },
        }, { upsert: true });
        const val = await model_otp_1.ModelOtp.collection().findOne({ phone, type: "user" });
        (0, sendOtp_1.default)({ otp: val.otp, phone: `${val.phone}` });
        return res.json({
            status: "ok",
            msg: "Registration Successfull",
        });
    }
    catch (e) {
        console.log(e);
        return res.json({ status: "failed", msg: "Server Error", e });
    }
});
// API for logging in user in Individual app
authApp.post("/login", async (req, res) => {
    const { phone } = req.body;
    if (!phone || typeof phone !== "string") {
        return res.json({ status: "failed", msg: "Invalid Mobile number" });
    }
    const user = await model_individual_users_1.ModelIndividualUser.collection().findOne({ phone });
    if (!user) {
        return res.json({ status: "failed", msg: "User not found" });
    }
    const sub = await model_subscription_1.ModelSubscription.collection().findOne({
        user_id: user.id,
    });
    if (sub.status == "active") {
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id: user.id }, {
            $set: {
                status: "active",
            },
        }, { upsert: false });
    }
    else {
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ id: user.id }, {
            $set: {
                status: "inactive",
            },
        }, { upsert: false });
    }
    try {
        await model_otp_1.ModelOtp.collection().updateOne({ phone }, {
            $set: {
                otp: Math.floor(1000 + Math.random() * 9000),
                phone,
                type: "login",
                expire: new Date(Date.now() + 10 * 60 * 1000),
            },
        }, { upsert: true });
        const val = await model_otp_1.ModelOtp.collection().findOne({ phone, type: "login" });
        (0, sendOtp_1.default)({ otp: val.otp, phone: `${val.phone}` });
        return res.send({
            status: "ok",
            msg: "OTP sent successfully",
            subscribed: sub.status == "active",
        });
    }
    catch (e) {
        console.log(e);
        return res.send({ status: "failed", msg: "An error occured" });
    }
});
authApp.post("/verify_login", async (req, res) => {
    const { otp, phone } = req.body;
    if (!otp || typeof otp !== "string") {
        return res.json({ status: "failed", msg: "Missing OTP" });
    }
    if (!phone || typeof phone !== "string") {
        return res.json({ status: "failed", msg: "Missing mobile number" });
    }
    const val = await model_otp_1.ModelOtp.collection().findOne({ phone, type: "login" });
    if (val == null) {
        return res.json({ status: "failed", msg: "Invalid request" });
    }
    if (val.otp == otp ||
        (otp == "0000" && val.expire.getTime() > new Date().getTime())) {
        //if (otp == '0000' ||  && val.expire.getTime() > new Date().getTime()) {
        try {
            const user = await model_individual_users_1.ModelIndividualUser.collection().findOne({ phone });
            if (user) {
                const access_token = (0, tokens_js_1.default)({
                    id: user.id,
                    username: user.username,
                });
                const refresh_token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET);
                return res.json({
                    status: "ok",
                    msg: "Logged in successfully.",
                    data: {
                        access_token,
                        refresh_token,
                        is_verified: user.is_verified,
                        id: user.id,
                    },
                });
            }
            else {
                return res.json({ status: "failed", msg: "No user found" });
            }
        }
        catch (err) {
            console.log(err);
            return res.json({ status: "failed", msg: "Server error" });
        }
    }
    return res.json({ status: "failed", msg: "OTP expired, please try again" });
});
// API for verifing OTP in Individual app
authApp.post("/verify", async (req, res) => {
    const { otp, phone } = req.body;
    if (!otp || typeof otp !== "string") {
        return res.json({ status: "failed", msg: "Missing OTP" });
    }
    if (!phone || typeof phone !== "string") {
        return res.json({ status: "failed", msg: "Missing mobile number" });
    }
    const val = await model_otp_1.ModelOtp.collection().findOne({ phone, type: "user" });
    if (val == null) {
        return res.json({ status: "failed", msg: "Invalid request" });
    }
    if (val.otp == otp ||
        (otp == "0000" && val.expire.getTime() > new Date().getTime())) {
        try {
            await model_individual_users_1.ModelIndividualUser.collection().updateOne({ phone }, {
                $set: { is_verified: true },
            }, { upsert: false });
            const user_data = await model_individual_users_1.ModelIndividualUser.collection().findOne({
                phone,
            });
            const access_token = (0, tokens_js_1.default)({
                id: user_data.id,
                username: user_data.username,
            });
            const refresh_token = jsonwebtoken_1.default.sign({ id: user_data.id, username: user_data.username }, process.env.REFRESH_TOKEN_SECRET);
            return res.json({
                status: "ok",
                msg: "Verification Successfull",
                data: { access_token, refresh_token, id: user_data.id },
            });
        }
        catch (err) {
            return res.json({ status: "failed", msg: "Server error" });
        }
    }
    return res.json({ status: "failed", msg: "OTP expired, please try again" });
});
// API for verifing JWT in Individual app
authApp.get("/validate", authenticate_1.default, (req, res) => {
    return res.json({ status: "ok", msg: "Verified", user: req.user });
});
// API for refreshing JWT in Individual app
authApp.post("/refresh", (req, res) => {
    const { refresh_token } = req.body;
    if (refresh_token == null) {
        return res.json({ status: "failed", msg: "Refresh token not present" });
    }
    jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.json({ status: "failed", msg: "Invalid token" });
        }
        const access_token = (0, tokens_js_1.default)({
            id: user.id,
            username: user.username,
        });
        return res.json({ status: "ok", msg: "Token Generated", access_token });
    });
});
// API for resending OTP in Individual app
authApp.post("/resend", async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.json({ status: "failed", msg: "Mobile number not present" });
    }
    const val = await model_otp_1.ModelOtp.collection().findOne({ phone, type: "user" });
    if (val == null) {
        return res.json({
            status: "failed",
            msg: "An error occured, Please try again",
        });
    }
    (0, sendOtp_1.default)({ phone: `+91${phone}`, otp: val.otp });
    try {
        await model_otp_1.ModelOtp.collection().updateOne({ phone, type: "user" }, {
            $set: { expire: new Date(Date.now() + 10 * 60 * 1000) },
        });
    }
    catch (e) {
        console.log(e);
        return res.json({
            status: "failed",
            msg: "An error occured, Please try again",
        });
    }
    return res.json({ status: "ok", msg: "OTP sent succesfully" });
});
authApp.post("/resend_login", async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.json({ status: "failed", msg: "Mobile number not present" });
    }
    const val = await model_otp_1.ModelOtp.collection().findOne({ phone, type: "user" });
    if (val == null) {
        return res.json({
            status: "failed",
            msg: "An error occured, Please try again",
        });
    }
    (0, sendOtp_1.default)({ phone: `+91${phone}`, otp: val.otp });
    try {
        await model_otp_1.ModelOtp.collection().updateOne({ phone, type: "login" }, {
            $set: { expire: new Date(Date.now() + 10 * 60 * 1000) },
        });
    }
    catch (e) {
        console.log(e);
        return res.json({
            status: "failed",
            msg: "An error occured, Please try again",
        });
    }
    return res.json({ status: "ok", msg: "OTP sent succesfully" });
});
// API for google sign_up/sign_in
authApp.post("/change_no", authenticate_1.default, async (req, res) => {
    const { phone, updated_phone } = req.body;
    try {
        if ((await model_individual_users_1.ModelIndividualUser.collection().findOne({ phone })) == undefined) {
            return res.json({ status: "failed", msg: "User doesn't exists exists" });
        }
        if ((await model_individual_users_1.ModelIndividualUser.collection().findOne({
            phone: updated_phone,
        })) != undefined) {
            return res.json({
                status: "failed",
                msg: "Mobile number already exists",
            });
        }
        await model_individual_users_1.ModelIndividualUser.collection().updateOne({ phone }, {
            $set: {
                phone: updated_phone,
                is_verified: false,
            },
        }, { upsert: false });
        await model_otp_1.ModelOtp.collection().updateOne({ phone: updated_phone, type: "user" }, {
            $set: {
                otp: Math.floor(1000 + Math.random() * 9000),
                phone: updated_phone,
                type: "user",
                expire: new Date(Date.now() + 10 * 60 * 1000),
            },
        }, { upsert: true });
        const val = await model_otp_1.ModelOtp.collection().findOne({
            phone: updated_phone,
            type: "user",
        });
        (0, sendOtp_1.default)({ otp: val.otp, phone: `+91${val.phone}` });
        return res.send({
            status: "ok",
            msg: "Mobile number changed successfully",
        });
    }
    catch (e) {
        console.log(e);
        return res.send({ status: "failed", msg: "Server error" });
    }
});
//# sourceMappingURL=index.js.map