"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
async function sendOtp(val) {
    try {
        const { data } = await axios_1.default.get(`http://bhashsms.com/api/sendmsg.php?user=ameenreddy&pass=123&sender=TEINNO&phone=${val.phone}&text=Dear%20Customer,%${val.otp}%20is%20your%20OTP.%20Do%20not%20share%20this%20OTP%20with%20anyone.%20Thank%20you.%20-%20TEINNO&priority=ndnd&stype=normal`);
        console.log(data);
        return data;
    }
    catch (e) {
        console.log(e);
    }
}
module.exports = sendOtp;
//# sourceMappingURL=sendOtp.js.map